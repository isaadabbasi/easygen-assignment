import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { constants, envs } from "src/utils";

const { APIRoutes } = constants;

export class HttpService {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: envs.APIServerURL,
      withCredentials: true,
    });

    this.register403Interceptor();
  }

  private register403Interceptor() {
    this.httpClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const initialRequest = error.config;

        // We don't need to refresh-token on 401 if request is signin or signup
        const pathname = new URL(error.request.responseURL).pathname
        if ([
          APIRoutes.SignIn,
          APIRoutes.SignUp,
        ].includes(pathname as any)) {
          return Promise.reject(error);
        }

        // If there is no originalRequest._retry flag and status is 401,
        // It means  we need to refresh the token
        const {
          status,
          data: { message = "" },
        } = error.response;

        if (
          status === 401 &&
          message === "Unauthorised" &&
          !initialRequest._retry
        ) {
          initialRequest._retry = true;

          console.log("Initial Request: ", initialRequest);

          await this.httpClient.post(APIRoutes.RefreshToken);

          return axios(initialRequest);
        }

        return Promise.reject(error);
      }
    );
  }

  public getHttpClient() {
    // Exposing getHttpClient if more control of httpClient is needed
    return this.httpClient;
  }

  private unwrapError(axiosError: any) {
    // axiosError: AxiosError<string | string[]> but weird generics by axios that's why using :any
    const { message } = axiosError.response.data;
    if (typeof message === "string") {
      return [message];
    }
    return message;
  }

  public async post<
    R = (typeof APIRoutes)[keyof typeof APIRoutes],
    B = any,
    V = any
  >(route: R, payload: B, config?: AxiosRequestConfig): Promise<V> {
    try {
      const response = await this.getHttpClient().post(
        route as string,
        payload,
        config
      );

      return response.data;
    } catch (e: any) {
      const errors = this.unwrapError(e);
      return Promise.reject(errors);
    }
  }

  public async get<R = (typeof APIRoutes)[keyof typeof APIRoutes], V = any>(
    route: R,
    config?: AxiosRequestConfig
  ): Promise<V> {
    try {
      const response = await this.getHttpClient().get(route as string, config);

      return response.data;
    } catch (e: any) {
      const errors = this.unwrapError(e);
      return Promise.reject(errors);
    }
  }
}

export const httpService = new HttpService();
