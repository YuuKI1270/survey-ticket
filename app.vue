<template>
  <NuxtLoadingIndicator />
  <Suspense>
    <template #default>
      <NuxtPage />
    </template>
    <template #fallback> Loading... </template>
  </Suspense>
</template>

<script setup>
import { Suspense } from "vue";
</script>
