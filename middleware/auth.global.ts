import { useAuthStore } from "~/composables/states";

export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("access_token");

  const authenticated = useAuthStore();
  preloadRouteComponents("/");

  if (token.value) {
    // check if value exists
    // todo verify if token is valid, before updating the state
    authenticated.value = true; // update the state to authenticated
  }
  // if token exists and url is /login redirect to homepage
  if (token.value && to?.name === " ") {
    return navigateTo("/");
  }

  // if token doesn't exist redirect to log in
  if (!token.value && to?.name !== "auth") {
    abortNavigation();
    return navigateTo("/auth");
  }
});
