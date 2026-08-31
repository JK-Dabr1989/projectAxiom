export type ScaleConnectionState = "idle" | "connecting" | "connected" | "unavailable" | "error";

export interface ScaleTransport {
  readonly kind: string;
  getState(): ScaleConnectionState;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sendCommand(command: string): Promise<string[]>;
}

export class UnavailableScaleTransport implements ScaleTransport {
  readonly kind = "unavailable";
  private state: ScaleConnectionState = "unavailable";

  getState(): ScaleConnectionState {
    return this.state;
  }

  async connect(): Promise<void> {
    this.state = "unavailable";
    throw new Error("Physical scale communication is not enabled in this Axiom Web validation build.");
  }

  async disconnect(): Promise<void> {
    this.state = "unavailable";
  }

  async sendCommand(): Promise<string[]> {
    throw new Error("Physical scale communication is not enabled in this Axiom Web validation build.");
  }
}
