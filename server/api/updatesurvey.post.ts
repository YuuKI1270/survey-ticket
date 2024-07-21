import axios from "axios";
import { ROUTE_API } from "~/utils/routes-utils";
import https from "https";

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const body = await readBody(event);
  const BASE_API_URL = runtimeConfig.public.API_URL;
  const accessToken = getCookie(event, "access_token");

  return await axios({
    method: "post",
    url: `${BASE_API_URL}${ROUTE_API.updatesurvey}${body.ticketid}`,
    data: body.states,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  })
    .then(function (response) {
      const data: ISurveyUpdate.RootResponse = response.data;
      return data;
    })
    .catch(function (response) {
      //handle error
      return response;
    });
});
