import { constants } from "src/utils";

const { AppSessionId } = constants;

export class PersistantStorageService {
  public getAppSessionId(): string | null {
    return localStorage.getItem(AppSessionId);
  }

  public setAppSessionId(value: string): void {
    localStorage.setItem(AppSessionId, value);
  }

  public removeSessionId(): void {
    localStorage.removeItem(AppSessionId);
  }
}

export const persistantStorageService = new PersistantStorageService();
