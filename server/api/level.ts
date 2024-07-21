import axios from "axios";
import { ROUTE_API } from "~/utils/routes-utils";
import https from "https";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const body = await readBody(event);
  const accessToken = getCookie(event, "access_token");
  const BASE_API_URL = runtimeConfig.public.API_URL;

  return await axios({
    method: "get",
    url: `${BASE_API_URL}${ROUTE_API.levelList}`,
    params: {
      isselected: body.isselected,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  })
    .then(function (response) {
      const data: ILevel.RootResponse = response.data;
      return data;
    })
    .catch(function (response) {
      //handle error
      return response;
    });
});
