<script setup lang="ts">
defineProps({
  title: String,
  value: String
})
</script>

<template>
  <div class="flex flex-col bg-background border border-border rounded-xl p-4">
    <h3 class="font-medium text-sm">{{ title }}</h3>
    <div class="text-2xl font-semibold">{{ value }}</div>
  </div>
</template>

<style scoped>

</style>