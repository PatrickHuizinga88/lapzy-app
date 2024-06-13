<script setup lang="ts">
defineProps({
  title: String,
  value: String,
  loading: Boolean
})
</script>

<template>
  <div class="w-36 flex flex-col bg-background border border-border rounded-lg p-4">
    <h3 class="font-medium text-sm text-muted-foreground mb-1">{{ title }}</h3>
    <div v-if="!loading" class="text-2xl font-semibold">{{ value }}</div>
    <Skeleton v-else class="w-10 h-8 rounded-md" />
  </div>
</template>

<style scoped>

</style>