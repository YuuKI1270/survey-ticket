import https from "https";
import axios from "axios";
import { ROUTE_API } from "~/utils/routes-utils";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const body = await readBody(event);
  const accessToken = getCookie(event, "access_token");
  const BASE_API_URL = runtimeConfig.public.API_URL;

  return await axios({
    method: "get",
    url: `${BASE_API_URL}${ROUTE_API.departmentList}`,
    params: {
      brand_id: body.brand_id,
    },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  })
    .then(function (response) {
      const data: IDepartment.RootResponse = response.data;
      return data;
    })
    .catch(function (response) {
      //handle error
      return response;
    });
});
//brand_id: body.brand_id,
