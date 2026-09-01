import { describe, expect, it } from "vitest";
import { buildBackup, decodeBackup } from "../src/data/backup";
import { defaultSettings } from "../src/persistence/db";

describe("backup format", () => {
  it("round-trips a valid versioned Axiom Web backup", () => {
    const backup = buildBackup({
      settings: defaultSettings(),
      logs: [],
      recipes: [],
      ingredients: [],
      identities: [],
      sourceMappings: [],
      exportedAt: "2026-08-31T12:00:00",
    });
    expect(decodeBackup(JSON.stringify(backup))).toEqual(backup);
  });

  it("restores older backups without food preference data", () => {
    const backup = buildBackup({
      settings: defaultSettings(),
      logs: [],
      recipes: [],
      ingredients: [],
      identities: [],
      sourceMappings: [],
      exportedAt: "2026-08-31T12:00:00",
    });
    const legacy = { ...backup, data: { ...backup.data, foodPreferences: undefined } };
    delete legacy.data.foodPreferences;
    expect(decodeBackup(JSON.stringify(legacy)).data.foodPreferences).toEqual([]);
  });

  it("rejects malformed or unsupported backup files before restore", () => {
    expect(() => decodeBackup("not-json")).toThrow("Invalid JSON backup");
    expect(() => decodeBackup(JSON.stringify({ version: "old", data: {} }))).toThrow("Unsupported backup version");
    expect(() => decodeBackup(JSON.stringify({ version: "axiom-web-backup-v1", data: { logs: [] } }))).toThrow("Backup is missing required section");
  });
});
