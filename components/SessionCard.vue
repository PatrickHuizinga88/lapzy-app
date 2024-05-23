<script setup lang="ts">
import type {Session} from "~/types";
import {Dot, TextSelect} from "lucide-vue-next";

defineProps<{
  session: Session
  trackName: string
  trackLocation: string
}>()
</script>

<template>
  <NuxtLink :to="`/sessions/${session.id}`" class="flex items-center justify-between gap-6 bg-muted rounded-lg p-4 hover:bg-muted/80">
    <div class="w-full">
      <div class="font-medium mb-0.5">
        {{ trackName || trackLocation }}
      </div>
      <div class="flex items-center">
        <div class="text-sm text-muted-foreground">{{ $dayjs(session.created_at).format('DD-MM-YYYY') }}</div>
        <div v-if="session.note" class="flex items-center text-muted-foreground">
          <Dot class="size-4"/><TextSelect class="size-5" />
        </div>
      </div>
    </div>
    <div class="text-lg font-medium">{{ session.duration || '-' }}</div>
  </NuxtLink>
</template>
