import axios from "axios";
import { ROUTE_API } from "~/utils/routes-utils";
import https from "https";
interface AuthResponse {
  status: string;
  username: string;
  brandid: number;
  access_token: string;
  refresh_token: string;
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const body = await readBody(event);

  const BASE_API_URL = runtimeConfig.public.API_URL;
  const newForm = new FormData();
  newForm.append("username", body.username);
  newForm.append("password", body.password);

  return await axios({
    method: "post",
    url: `${BASE_API_URL}${ROUTE_API.login}`,
    data: newForm,
    headers: { "Content-Type": "*" },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  })
    .then(function (response) {
      const data: AuthResponse = response.data;
      setCookie(event, "access_token", data.access_token, {
        path: "/",
        sameSite: "strict",
      });
      setCookie(event, "refresh_token", data.refresh_token, {
        path: "/",
        sameSite: "strict",
        // //handle success
      });
      return data;
    })
    .catch(function (error) {
      //handle error
      return error;
    });
});
