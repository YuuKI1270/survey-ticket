import axios from "axios";
import { ROUTE_API } from "~/utils/routes-utils";
import https from "https";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig(event);
  const body = await readBody(event);
  const accessToken = getCookie(event, "access_token");
  const BASE_API_URL = runtimeConfig.public.API_URL;

  // Use the department ID to call the status API
  return await axios({
    method: "get",
    url: `${BASE_API_URL}${ROUTE_API.statusList}`,
    params: {
      dep_id: body.dep_id,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  })
    .then(function (response) {
      const data: IStatus.RootResponse = response.data;
      return data;
    })
    .catch(function (response) {
      //handle error
      return response;
    });
});
//dep_id: body.dep_id,
