import { AxiosError } from "axios";
import { httpService, HttpService } from "src/services";
import { constants } from "src/utils";

import { IAuth } from "src/defs";

const { APIRoutes } = constants;

export class AuthService {
  constructor(private httpService: HttpService) {}

  async signUp(payload: IAuth.ISignUpPayload): Promise<void> {
    try {
      await this.httpService.getHttpClient().post(APIRoutes.SignUp, payload);
    } catch (error) {
      throw (error as AxiosError).response?.data;
    }
  }

  async signIn(payload: IAuth.ISignInPayload): Promise<void> {
    try {
      await this.httpService.getHttpClient().post(APIRoutes.SignIn, payload);
    } catch (error) {
      throw (error as AxiosError).response?.data;
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.httpService.getHttpClient().post(APIRoutes.SignOut);
    } catch (error) {
      throw (error as AxiosError).response?.data;
    }
  }
}

export const authService = new AuthService(httpService);
