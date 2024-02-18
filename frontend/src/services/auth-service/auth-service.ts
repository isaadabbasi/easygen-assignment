import { httpService, HttpService } from "src/services";
import { constants } from "src/utils";

import { IAuth } from "src/defs";

const { APIRoutes } = constants;

export class AuthService {
  constructor(private httpService: HttpService) {}

  async signUp(payload: IAuth.ISignUpPayload): Promise<string> {
    return this.httpService.post(APIRoutes.SignUp, payload);
  }

  async signIn(payload: IAuth.ISignInPayload): Promise<string> {
    return this.httpService.post(APIRoutes.SignIn, payload);
  }

  async signOut(): Promise<void> {
    return this.httpService.post(APIRoutes.SignOut, void 0);
  }

  async fetchProtectedData(): Promise<IAuth.IUser> {
    return this.httpService.get(APIRoutes.Protected);
  }
}

export const authService = new AuthService(httpService);
