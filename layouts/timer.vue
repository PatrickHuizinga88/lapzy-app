<script setup lang="ts">
import {NotificationList} from "~/components/ui/notification";
import NavBar from "~/components/layout/NavBar.vue";
import Header from "~/components/layout/Header.vue";

const notificationStore = useNotificationStore()
</script>

<template>
  <NuxtLoadingIndicator color="hsl(var(--primary))"/>

  <Header />

  <main class="flex flex-col h-[calc(100svh-var(--header-height))]">
    <div class="flex-1 py-6">
      <div class="h-full container">
        <slot/>
      </div>
    </div>

    <NavBar/>

  </main>

  <NotificationList :notifications="notificationStore.notifications"/>

</template>

<style>

</style>