import type { TokenWriteQueueItem } from "../domain/tokenWriting";
import type { ScaleConnectionState } from "./ScaleTransport";

export interface TokenWriterStatus {
  connectionState: ScaleConnectionState;
  tokenWriteMode: "inactive" | "ready" | "writing" | "verifying" | "complete" | "error";
  message: string;
}

export interface TokenWriter {
  getStatus(): TokenWriterStatus;
  connectScale(): Promise<void>;
  prepareSession(): Promise<void>;
  sendToken(job: TokenWriteQueueItem): Promise<void>;
  cancelCurrent(): Promise<void>;
}

export class UnavailableTokenWriter implements TokenWriter {
  getStatus(): TokenWriterStatus {
    return {
      connectionState: "unavailable",
      tokenWriteMode: "inactive",
      message: "Scale token writing will become available when your scale supports Web App connection.",
    };
  }

  async connectScale(): Promise<void> {
    throw new Error(this.getStatus().message);
  }

  async prepareSession(): Promise<void> {
    throw new Error(this.getStatus().message);
  }

  async sendToken(): Promise<void> {
    throw new Error(this.getStatus().message);
  }

  async cancelCurrent(): Promise<void> {
    return;
  }
}
