<script setup lang="ts">
import type {Session} from "~/types";

defineProps<{
  session: Session
  trackName: string
}>()
</script>

<template>
  <NuxtLink :to="`/sessions/${session.id}`" class="flex items-center justify-between bg-muted rounded-lg p-4 hover:bg-muted/80">
    <div>
      <div class="font-medium">{{ trackName }}</div>
      <div class="text-sm text-muted-foreground">{{ $dayjs(session.created_at).format('DD-MM-YYYY') }}</div>
    </div>
    <div class="text-lg font-medium">{{ session.duration || '-' }}</div>
  </NuxtLink>
</template>
