import { httpService, HttpService } from "src/services";
import { constants } from "src/utils";

import { IAuth } from "src/defs";

const { APIRoutes } = constants;

export class AuthService {
  constructor(private httpService: HttpService) {}

  private async post<
    T = (typeof APIRoutes)[keyof typeof APIRoutes],
    U = IAuth.ISignUpPayload | IAuth.ISignUpPayload | void,
    V = string | void
  >(route: T, payload: U): Promise<V> {
    try {
      const response = await this.httpService
        .getHttpClient()
        .post(route as string, payload);

      return response.data;
    } catch (e: any) {
      const { message } = e.response.data;
      // e: AxiosError<string | string[]> but weird generics by axios that's why using :any
      if (typeof message === "string") {
        return Promise.reject([message]);
      }
      return Promise.reject(message);
    }
  }
  async signUp(payload: IAuth.ISignUpPayload): Promise<string> {
    return this.post(APIRoutes.SignUp, payload);
  }

  async signIn(payload: IAuth.ISignInPayload): Promise<string> {
    return this.post(APIRoutes.SignIn, payload);
  }

  async signOut(): Promise<void> {
    return this.post(APIRoutes.SignOut, void 0);
  }
}

export const authService = new AuthService(httpService);
