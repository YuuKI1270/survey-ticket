<template>
  <header class="h-16">
    <!-- <UContainer class="flex items-center py-2"> -->
    <div class="flex items-center py-2 mx-3.5">
      <div>
        <UButton
          @click="isOpenSlide = true"
          icon="mynaui:list"
          size="xl"
          variant="ghost"
        />
        <USlideover v-model="isOpenSlide" side="left">
          <UCard
            class="flex flex-col flex-1"
            :ui="{
              body: { base: 'flex-1' },
              ring: '',
              divide: 'divide-y divide-gray-100 dark:divide-gray-800',
            }"
          >
            <template #header>
              <div class="flex items-center justify-between">
                <NuxtImg
                  width="125"
                  height="64"
                  src="https://online.com.kh/wp-content/uploads/2018/06/online_logo.png"
                  alt="logo"
                />

                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-x-mark-20-solid"
                  class="-my-1"
                  @click="isOpenSlide = false"
                />
              </div>
            </template>

            <div class="space-y-4">
              <NuxtLink
                :class="{ 'bg-gray-200': isActive('/') }"
                to="/"
                class="w-full text-lg px-4 font-bold py-2 mt-4 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 hover:bg-slate-100"
              >
                Survey report
                <UIcon color="grey" name="mynaui:file" size="20" />
              </NuxtLink>
              <div>
                <NuxtLink
                  :class="{ 'bg-gray-200': isActive('/survey/online-report') }"
                  to="/survey/online-report"
                  class="w-full px-4 py-2 mt-4 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 hover:bg-slate-100"
                >
                  Online survey report
                </NuxtLink>
              </div>
              <div class="mt-5">
                <NuxtLink
                  :class="{ 'bg-gray-200': isActive('/survey/ih-report') }"
                  to="/survey/ih-report"
                  class="w-full px-4 py-2 mt-4 border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 hover:bg-slate-100"
                >
                  IH survey report
                </NuxtLink>
              </div>
            </div>
          </UCard>
        </USlideover>
      </div>
      <NuxtImg
        width="125"
        height="64"
        src="https://online.com.kh/wp-content/uploads/2018/06/online_logo.png"
        alt="logo"
      />

      <div class="flex-1"></div>
      <div class="flex items-center space-x-4 p-1">
        <span class="font-medium"> {{ username }} </span>
        <UAvatar :alt="username" size="sm" class="bg-yellow-200" />
        <UButton
          icon="mynaui:logout"
          size="xl"
          class="text-red-500"
          variant="ghost"
          color="red"
          @click="logout"
        />
      </div>
      <!-- </UContainer> -->
    </div>
  </header>
  <slot />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { useUser } from "~/composables/states";

const route = useRoute();

const router = useRouter();

const isOpenSlide = ref(false);

const user = useUser();

const username = user.$state.user.username;

const isActive = computed(() => (destination: string) => {
  return route.path === destination;
});
// Function to handle logout
function logout() {
  // Clear cookies
  const tokenCookie = useCookie("access_token");
  const tokenRefreshCookie = useCookie("refresh_token");
  tokenCookie.value = null;
  tokenRefreshCookie.value = null;
  localStorage.clear();
  user.$reset();
  router.push("/auth");
}

// Computed property to extract the username from the user data
</script>
~/composables/states
