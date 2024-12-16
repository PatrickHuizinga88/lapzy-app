<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import {Input} from "~/components/ui/input";

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Inloggen - Lapzy',
  description: 'Log in met je account om aan de slag te gaan.'
})

const supabase = useSupabaseClient()

const form = reactive({
  email: '',
  password: ''
})
const errorMessage = ref('')
const loading = ref(false)

const signIn = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithPassword({
      email:    form.email,
      password: form.password
    })
    if (error) {
      loading.value = false
      throw error
    }
    navigateTo('/')
  } catch (error) {
    errorMessage.value = 'Inloggen mislukt'
  }
}
</script>

<template>
  <div class="mt-10 sm:mx-auto w-full sm:max-w-[480px]">
    <div class="bg-background px-6 py-12 sm:shadow-xl sm:rounded-xl sm:px-12">
      <form class="space-y-6" @submit.prevent="signIn">
        <div>
          <Label for="email">E-mailadres</Label>
          <div class="mt-2">
            <Input
                v-model="form.email"
                id="email"
                name="email"
                type="email"
                required />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <Label for="password">Wachtwoord</Label>
<!--            <Button variant="link" size="sm" class="h-auto p-0" as-child>-->
<!--              <NuxtLink to="#">Wachtwoord vergeten?</NuxtLink>-->
<!--            </Button>-->
          </div>
          <div class="mt-2">
            <Input
                v-model="form.password"
                id="password"
                name="password"
                type="password"
                required />
          </div>
        </div>

        <div>
          <Button type="submit" :disabled="loading" class="w-full">
            <div v-if="loading" role="status" class="mr-2">
              <Loader2 class="size-5 animate-spin"/>
              <span class="sr-only">Aan het laden...</span>
            </div>
            Inloggen
          </Button>
        </div>

        <p class="text-sm text-destructive">{{ errorMessage }}</p>

      </form>
    </div>

    <p class="mt-10 text-center text-sm text-muted-foreground">
      Heb je geen account?
      {{ ' ' }}
      <Button variant="link" size="sm" class="px-0" as-child>
        <NuxtLink to="/register">Meld je aan</NuxtLink>
      </Button>
    </p>
  </div>
</template>
