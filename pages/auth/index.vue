<script setup lang="ts">
import type { FormErrorEvent, FormError, FormSubmitEvent } from "#ui/types";
import { useAuthStore, useUser } from "~/composables/states";

// middleware
definePageMeta({
  middleware: [function (to, from) {}, "checkstate"],
});

//state
const state = reactive({
  username: "",
  password: "",
  authenticated: false,
});

const isLoading = ref(false);

const errorMessage = ref("");

const passwordVisible = ref(false);

const form = ref();

// Validate function to check form fields
function togglePasswordVisibility() {
  passwordVisible.value = !passwordVisible.value;
}

function validate(state: any): FormError[] {
  const errors = [];
  if (!state.username)
    errors.push({ path: "username", message: "Username is required" });
  if (!state.password)
    errors.push({ path: "password", message: "Password is required" });
  return errors;
}

async function onError(event: FormErrorEvent) {
  const element = document.getElementById(event.errors[0].id);
  element?.focus();
  element?.scrollIntoView({ behavior: "smooth", block: "center" });
}

async function onSubmit(event: FormSubmitEvent<any>) {
  isLoading.value = true;
  form.value.clear();
  const data = await $fetch("/api/login", {
    lazy: false,
    server: false,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      username: event.data.username,
      password: event.data.password,
    },

    onRequest({ options }) {
      // Set the request headers
      const headers = new Headers(options.headers);
      options.query = options.query || {};
      options.headers = options.headers || {};
      headers.set("Authorization", `Bearer `);
      options.headers = headers;
    },
    onRequestError({ request, options, error }) {
      // Handle the request errors
      isLoading.value = false;
    },
    onResponse({ response }) {
      const authenticated = useAuthStore();
      const token = useCookie("access_token");
      const user = useUser();
      const refreshToken = useCookie("refresh_token");
      token.value = response._data.access_token;
      refreshToken.value = response._data.refresh_token;
      user.$state.user = response._data;

      // Handle the response success
      authenticated.value = true;
      isLoading.value = true;
      navigateTo("/");
    },
    onResponseError({ response }) {
      isLoading.value = false;
      if (response._data.message === "Request failed with status code 400") {
        errorMessage.value = "Bed request";
      }
      if (response._data.message === "Request failed with status code 401") {
        errorMessage.value = "Incorrect Username or password";
      }
      if (response._data.message === "Request failed with status code 404") {
        errorMessage.value = "Not Found";
      }
      if (response._data.message === "Request failed with status code 403") {
        errorMessage.value = "Forbidden";
      }
      if (response.status === 500) {
        errorMessage.value = "Internal server error";
      }
    },
  });
}
</script>

<template>
  <Suspense>
    <UContainer class="h-screen flex flex-col items-center justify-center">
      <div class="flex flex-col space-y-6 items-center">
        <NuxtImg
          width="200"
          src="https://online.com.kh/wp-content/uploads/2018/06/online_logo.png"
        />
        <UForm
          :validate="validate"
          :state="state"
          class="space-y-4 min-w-72"
          @submit="onSubmit"
          @error="onError"
          ref="form"
        >
          <UFormGroup name="username">
            <UInput
              v-model="state.username"
              size="lg"
              placeholder="Username"
              type="text"
            />
          </UFormGroup>

          <UFormGroup name="password">
            <div class="relative w-full">
              <UInput
                v-model="state.password"
                placeholder="Password"
                :type="passwordVisible ? 'text' : 'password'"
                class=""
                size="lg"
              />
              <UButton
                @click="togglePasswordVisibility"
                :icon="passwordVisible ? 'mynaui:eye-slash' : 'mynaui:eye'"
                size="lg"
                color="gray"
                variant="ghost"
                class="absolute inset-y-1 right-1 flex items-center px-2 hover:bg-slate-200"
                :disabled="isLoading"
              />
            </div>
          </UFormGroup>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
          <UButton
            type="submit"
            class="w-full rounded-md"
            label="Login"
            block
            size="lg"
            color="primary"
            :disabled="isLoading"
          >
          </UButton>
        </UForm>
      </div>
    </UContainer>
  </Suspense>
</template>

<style>
.error-message {
  color: red;
}
.password-toggle {
  cursor: pointer;
}
</style>
