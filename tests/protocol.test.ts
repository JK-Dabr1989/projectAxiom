import { describe, expect, it } from "vitest";
import { parseRawLogLine, parseStatusBlock, scaleRecordToLogEntry } from "../src/protocol/smartScaleProtocol";

describe("SMARTSCALE_V3 parser", () => {
  it("parses status blocks and rejects protocol drift", () => {
    expect(parseStatusBlock(["PROTO:SMARTSCALE_V3", "MODE:SYNC", "BT:ON", "RTC:OK", "HX:OK", "NFC:OK", "FS:OK", "LOGS:3"]).protocolVersion).toBe("SMARTSCALE_V3");
    expect(() => parseStatusBlock(["PROTO:SMARTSCALE_V2"])).toThrow("Expected SMARTSCALE_V3");
  });

  it("parses EVT records using event id and inferred meal label", () => {
    const record = parseRawLogLine("EVT|evt_123|nfc|ingredient|fd_butter|Butter|20|2026-08-31 08:15:00||||0|default|Default");
    expect(record.recordId).toBe("evt_123");
    expect(record.eventType).toBe("WEIGHED_INGREDIENT");
    expect(record.mealLabel).toBe("breakfast");
    expect(record.grams).toBe(20);
  });

  it("maps scale records to idempotent log entries", () => {
    const record = parseRawLogLine("SHORTCUT|evt_456|ingredient|fd_banana|Banana|100|2026-08-31 12:20:00|default|Default");
    const entry = scaleRecordToLogEntry(record, new Set());
    expect(entry?.id).toBe("evt_456");
    expect(entry?.logHash).toBe("evt_456");
    expect(entry?.source).toBe("SCALE");
    expect(scaleRecordToLogEntry(record, new Set(["evt_456"]))).toBeNull();
  });
});
