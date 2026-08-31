import type { ScaleConnectionState, ScaleTransport } from "./ScaleTransport";

export class MockScaleTransport implements ScaleTransport {
  readonly kind = "mock";
  private state: ScaleConnectionState = "idle";

  getState(): ScaleConnectionState {
    return this.state;
  }

  async connect(): Promise<void> {
    this.state = "connected";
  }

  async disconnect(): Promise<void> {
    this.state = "idle";
  }

  async sendCommand(command: string): Promise<string[]> {
    if (command === "STATUS") {
      return [
        "PROTO:SMARTSCALE_V3",
        "MODE:SYNC",
        "BT:ON",
        "RTC:OK",
        "HX:OK",
        "NFC:OK",
        "FS:OK",
        "LOGS:2",
        "RECIPE_ACTIVE:0",
        "SELECTION_ACTIVE:0",
        "IDENTITY_ENABLED:1",
        "IDENTITY_TOKEN_REQUIRED:0",
      ];
    }
    if (command === "LOGS") {
      return [
        "EVT|evt_mock_1|nfc|ingredient|fd_butter|Butter|20|2026-08-31 08:15:00||||0|default|Default",
        "SHORTCUT|evt_mock_2|ingredient|fd_banana|Banana|100|2026-08-31 12:20:00|default|Default",
      ];
    }
    return [];
  }
}
