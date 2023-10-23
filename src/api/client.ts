import { Client } from "@hyper-fetch/core";

import { environment } from "config/environment.config";
import { STORAGE_FIELDS } from "constants/storage-fields.constants";
import { renewToken, TokensResponse } from "./auth";
import { ServerErrorType } from "./api.types";

export const client = new Client<ServerErrorType, any>({ url: environment.serverUrl })
  .onError(async (response, request) => {
    const refreshToken = localStorage.getItem(STORAGE_FIELDS.refreshToken);
    const isLoginEndpoint = request.endpoint.includes("login");

    if (!isLoginEndpoint && !request.used && refreshToken && response.status === 401) {
      const postRefreshToken = renewToken.setUsed(true);
      const { data } = await postRefreshToken.setData({ refreshToken }).send();

      const resData = data as unknown as TokensResponse;
      if (data?.token && data?.refreshToken) {
        // store.dispatch(setToken(data.token));
        localStorage.setItem(STORAGE_FIELDS.token, data.token);
        localStorage.setItem(STORAGE_FIELDS.refreshToken, data.refreshToken);

        return request
          .setUsed(true)
          .exec({ headers: { ...request.headers, Authorization: `Bearer ${resData.token}` } });
      }

      // todo: redirect to login page
    }
    return response;
  })
  .setQueryParamsConfig({
    arrayFormat: "comma",
    skipEmptyString: true,
  })
  .onAuth((command) => {
    // const state = store.getState();
    // const authToken = state.auth.token;

    // return command.setHeaders({
    //   Authorization: `Bearer ${authToken}`,
    //   ...command.headers,
    // });

    return command;
  });
