import type { LogEntry } from "../domain/models";
import { inferMealLabel } from "../domain/grouping";

export const PROTOCOL_VERSION = "SMARTSCALE_V3";

export interface ScaleDeviceStatus {
  mode: string;
  protocolVersion: string;
  bluetoothOn: boolean;
  rtcOk: boolean;
  hxOk: boolean;
  nfcOk: boolean;
  fsOk: boolean;
  logCount: number;
  identityEnabled: boolean;
  identityTokenRequired: boolean;
}

export interface ScaleLogRecord {
  recordId: string;
  eventType: "WEIGHED_INGREDIENT" | "RECIPE_STEP" | "RECIPE_EXTRA" | "PASSIVE" | "UNKNOWN";
  itemId: string | null;
  itemName: string | null;
  grams: number | null;
  timestamp: string;
  mealLabel: string | null;
  scaleSource: string | null;
  itemKind: string | null;
  recipeId: string | null;
  recipeName: string | null;
  stepIndex: number | null;
  extraFlag: boolean;
  identityId: string | null;
  identityName: string | null;
  rawLine: string;
}

export function parseStatusBlock(lines: string[]): ScaleDeviceStatus {
  const values = new Map<string, string>();
  for (const line of lines) {
    const index = line.indexOf(":");
    if (index <= 0) throw new Error(`Malformed STATUS line: ${line}`);
    values.set(line.slice(0, index), line.slice(index + 1).trim());
  }
  const protocol = values.get("PROTO");
  if (!protocol) throw new Error("Scale did not report a protocol version.");
  if (protocol !== PROTOCOL_VERSION) throw new Error(`Expected ${PROTOCOL_VERSION} but the scale reported ${protocol}.`);
  return {
    mode: values.get("MODE") ?? "",
    protocolVersion: protocol,
    bluetoothOn: values.get("BT") === "ON",
    rtcOk: values.get("RTC") === "OK",
    hxOk: values.get("HX") === "OK",
    nfcOk: values.get("NFC") === "OK",
    fsOk: values.get("FS") === "OK",
    logCount: Number.parseInt(values.get("LOGS") ?? "0", 10) || 0,
    identityEnabled: values.get("IDENTITY_ENABLED") === "1",
    identityTokenRequired: values.get("IDENTITY_TOKEN_REQUIRED") === "1",
  };
}

export function parseRawLogLine(line: string): ScaleLogRecord {
  const normalized = line.trim();
  const segments = normalized.split("|");
  if (segments[0] === "EVT") return parseEvtLog(segments, normalized);
  if (segments[0] === "SHORTCUT") return parseShortcutLog(segments, normalized);
  return {
    recordId: `unknown_${hashCode(normalized)}`,
    eventType: "UNKNOWN",
    itemId: null,
    itemName: null,
    grams: null,
    timestamp: new Date().toISOString(),
    mealLabel: null,
    scaleSource: null,
    itemKind: null,
    recipeId: null,
    recipeName: null,
    stepIndex: null,
    extraFlag: false,
    identityId: null,
    identityName: null,
    rawLine: normalized,
  };
}

export function parseRawLogLines(lines: string[]): ScaleLogRecord[] {
  return lines.filter((line) => line.trim()).map(parseRawLogLine);
}

export function scaleRecordToLogEntry(record: ScaleLogRecord, existingIds: Set<string>): LogEntry | null {
  if (!record.itemId || record.grams == null || !record.timestamp) return null;
  if (existingIds.has(record.recordId)) return null;
  return {
    id: record.recordId,
    foodId: record.itemId,
    grams: record.grams,
    timestamp: record.timestamp,
    source: "SCALE",
    zeroWeightFlag: record.grams === 0,
    identityId: record.identityId,
    identityName: record.identityName,
    mealLabelOverride: record.mealLabel ?? inferMealLabel(record.timestamp),
    scaleSource: record.scaleSource,
    scaleItemName: record.itemName,
    scaleRecipeId: record.recipeId,
    scaleRecipeName: record.recipeName,
    scaleStepIndex: record.stepIndex,
    scaleExtraFlag: record.extraFlag,
    scaleIdentityId: record.identityId,
    scaleIdentityName: record.identityName,
    scaleEventType: record.eventType,
    scaleIntakeEvent: true,
    scaleRawLine: record.rawLine,
    placeholderUnresolved: record.eventType === "UNKNOWN",
    originalFoodId: record.itemId,
    identityResolutionState: record.identityId ? "RESOLVED" : "PENDING",
    identitySource: record.identityId ? "EXPLICIT" : "UNKNOWN",
    logHash: record.recordId,
  };
}

function parseEvtLog(segments: string[], rawLine: string): ScaleLogRecord {
  if (segments.length < 14) throw new Error(`Malformed EVT line: ${rawLine}`);
  const extraFlag = segments[11] === "1";
  const recipeId = blankToNull(segments[8]);
  const itemId = blankToNull(segments[4]);
  const eventType = extraFlag ? "RECIPE_EXTRA" : recipeId ? "RECIPE_STEP" : "WEIGHED_INGREDIENT";
  const timestamp = parseFirmwareTimestamp(segments[7]);
  return {
    recordId: segments[1],
    eventType,
    itemId,
    itemName: blankToNull(segments[5]),
    grams: numberOrNull(segments[6]),
    timestamp,
    mealLabel: inferMealLabel(timestamp),
    scaleSource: blankToNull(segments[2]),
    itemKind: blankToNull(segments[3]),
    recipeId,
    recipeName: blankToNull(segments[9]),
    stepIndex: intOrNull(segments[10]),
    extraFlag,
    identityId: blankToNull(segments[12]),
    identityName: blankToNull(segments[13]),
    rawLine,
  };
}

function parseShortcutLog(segments: string[], rawLine: string): ScaleLogRecord {
  if (segments.length < 9) throw new Error(`Malformed SHORTCUT line: ${rawLine}`);
  const timestamp = parseFirmwareTimestamp(segments[6]);
  return {
    recordId: segments[1],
    eventType: "PASSIVE",
    itemId: blankToNull(segments[3]),
    itemName: blankToNull(segments[4]),
    grams: numberOrNull(segments[5]),
    timestamp,
    mealLabel: inferMealLabel(timestamp),
    scaleSource: "nfc",
    itemKind: blankToNull(segments[2]),
    recipeId: null,
    recipeName: null,
    stepIndex: null,
    extraFlag: false,
    identityId: blankToNull(segments[7]),
    identityName: blankToNull(segments[8]),
    rawLine,
  };
}

function parseFirmwareTimestamp(value: string): string {
  return value.replace(" ", "T");
}

function blankToNull(value?: string): string | null {
  return value && value.trim() ? value : null;
}

function numberOrNull(value: string): number | null {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function intOrNull(value: string): number | null {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function hashCode(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return hash;
}
