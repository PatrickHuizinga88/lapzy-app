<script setup lang="ts">
import {NotificationList} from "~/components/ui/notification";

defineProps<{
  title: string
  description?: string
}>()

const notificationStore = useNotificationStore()
</script>

<template>
  <div class="min-h-svh flex flex-col justify-center sm:bg-muted py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm text-center">
      <img src="~/assets/images/logo.svg" alt="Logo" class="mx-auto h-12 w-auto">
      <h2 class="mt-10 text-3xl font-bold leading-9 tracking-tight`text-center mb-2">{{ title }}</h2>
      <p v-if="description" class="text-muted-foreground`text-center">{{ description }}</p>
    </div>

    <slot/>

    <NotificationList :notifications="notificationStore.notifications" class="py-6"/>

  </div>
</template>