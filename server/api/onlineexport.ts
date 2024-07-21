import https from "https";
import axios from "axios";
import { ROUTE_API } from "~/utils/routes-utils";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const body = await readBody(event);
  const accessToken = getCookie(event, "access_token");
  const BASE_API_URL = runtimeConfig.public.API_URL;

  return await axios({
    method: "post",

    url: `${BASE_API_URL}${ROUTE_API.onlineExport}`,
    params: {
      start_date: body.startDate,
      end_date: body.endDate,
    },
    responseType: "arraybuffer",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  })
    .then(function (response) {
      const dataResponse = response.data;
      const data = new Blob([dataResponse], {
        type: "application/vnd.ms-excel",
      });
      return data;
    })
    .catch(function (error) {
      //handle error
      return error;
    });
});
//brand_id: body.brand_id,
