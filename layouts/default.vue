<script setup lang="ts">
import {User, Home, Timer, Calendar} from 'lucide-vue-next'
</script>

<template>
  <header class="sticky top-0 left-0 bg-background border-b border-border py-4">
    <div class="container">
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center">
          <img src="../assets/images/logo.svg" alt="Logo" class="h-6 mr-1"/>
          <div class="font-bold font-logo text-2xl italic">LAP<span class="text-muted-foreground">ZY</span></div>
        </NuxtLink>
        <Button variant="ghost" size="icon" class="-mr-2.5">
          <User class="size-5"/>
        </Button>
      </div>
    </div>
  </header>
  <main>
    <div class="pt-8 pb-24">
      <div class="container">
        <slot/>
      </div>
    </div>
    <div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border">
      <div class="grid grid-cols-3 h-full max-w-lg mx-auto font-medium text-xs">
        <NuxtLink
            to="/"
            class="inline-flex flex-col items-center justify-center gap-y-1 px-5 opacity-50"
            activeClass="!opacity-100"
        >
          <Home class="size-5"/>
          Home
        </NuxtLink>
        <NuxtLink
            to="/timer"
            class="inline-flex flex-col items-center justify-center gap-y-1 px-5 opacity-50"
            activeClass="!opacity-100"
        >
          <Timer class="size-5"/>
          Stopwatch
        </NuxtLink>
        <NuxtLink
            to="/sessions"
            class="inline-flex flex-col items-center justify-center gap-y-1 px-5 opacity-50"
            activeClass="!opacity-100"
        >
          <Calendar class="size-5"/>
          Sessies
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>