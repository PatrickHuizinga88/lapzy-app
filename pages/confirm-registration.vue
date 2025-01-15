<script setup lang="ts">
import {CheckCircle} from 'lucide-vue-next'

definePageMeta({
  layout: false
})
</script>

<template>
  <div class="min-h-svh flex flex-col justify-center sm:bg-muted py-12 lg:px-8">
    <div class="sm:mt-6 md:mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="flex flex-col items-center bg-background border px-6 py-10 shadow-[0_10px_50px_-15px] shadow-primary/25 sm:rounded-xl sm:px-10">
        <CheckCircle class="size-16 text-success mb-6"/>
        <h1 class="text-3xl font-semibold text-center mb-2">Je account is geactiveerd!</h1>
        <p class="text-muted-foreground text-center">Je kunt nu inloggen met het opgegeven e-mailadres en wachtwoord.</p>
        <Button href="/login" class="w-full mt-6" as-child>
          <NuxtLink to="/login">
            Doorgaan naar inloggen
          </NuxtLink>
        </Button>
      </div>
    </div>
  </div>
</template>
