<template>
  <UContainer class="error-data flex flex-col items-center justify-center">
    <UIcon name="mynaui:sad-square" class="text-7xl text-red-500" />
    <p class="font-medium">{{ message }}</p>
  </UContainer>
</template>

<script setup lang="ts">
interface IErrorData {
  message?: string;
}

const { message = "Something Went Wrong" } = defineProps<IErrorData>();
</script>

<style scoped>
.error-data {
  height: calc(100vh - 64px);
}
</style>
