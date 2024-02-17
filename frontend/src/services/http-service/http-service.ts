import axios, { AxiosInstance } from "axios";
import { constants, envs } from "src/utils";

const { APIRoutes } = constants

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

        // If there is no originalRequest._retry flag and status is 401,
        // It means  we need to refresh the token
        if (error.response.status === 401 && !initialRequest._retry) {
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
    return this.httpClient;
  }
}

export const httpService = new HttpService();
