import axios from "axios";
import { ROUTE_API } from "~/utils/routes-utils";
import https from "https";

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig();
    const body = await readBody(event);
    const BASE_API_URL = runtimeConfig.public.API_URL;
    const accessToken = getCookie(event, "access_token");

    const response = await axios({
      method: "get",
      url: `${BASE_API_URL}${ROUTE_API.getsurvey}${body.ticketid}`,
      params: {
        brand_id: body.brand_id,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });

    return response.data; // Return just the data from the response
  } catch (error) {
    // Log the error or handle it as needed

    // Return a standardized error response
    return {
      error: "Failed to fetch survey data. Please try again later.",
    };
  }
});
