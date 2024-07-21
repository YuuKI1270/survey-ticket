<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});
</script>

<template>
  <div
    class="h-screen w-screen flex flex-col items-center justify-center space-y-7"
  >
    <h1 class="text-9xl">{{ error?.statusCode }}</h1>
    <h1 class="text-3xl">{{ error?.message }}</h1>
    <NuxtLink to="/">
      <UButton
        color="primary"
        variant="solid"
        size="lg"
        icon="i-mynaui:arrow-left"
        >Button</UButton
      >
    </NuxtLink>
  </div>
</template>
