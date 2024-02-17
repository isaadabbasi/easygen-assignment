import { constants } from "src/utils";

const { AppSessionId } = constants;

export class PersistantStorageService {
  public getAppSessionId(): string | null {
    return localStorage.getItem(AppSessionId);
  }

  public setAppSessionId(value: string) {
    localStorage.setItem(AppSessionId, value);
  }
}

export const persistantStorageService = new PersistantStorageService();
