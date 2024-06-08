<script setup lang="ts">
defineProps({
  title: String,
  value: [String, Number],
})
</script>

<template>
  <div class="w-36 flex flex-col bg-background border border-border rounded-lg p-4">
    <h3 class="font-medium text-sm text-muted-foreground mb-1">{{ title }}</h3>
    <div class="text-2xl font-semibold">{{ value }}</div>
  </div>
</template>

<style scoped>

</style>