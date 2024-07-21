export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("access_token");

  // if token exists and url is /login redirect to homepage
  if (token.value) {
    return navigateTo("/");
  }
});
