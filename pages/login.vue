<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import {Input} from "~/components/ui/input";

definePageMeta({
  layout: 'auth'
})

const supabase = useSupabaseClient()

const form = reactive({
  email: '',
  password: ''
})
const errorMessage = ref<string>('')
const loading = ref<boolean>(false)

const signIn = async () => {
  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithPassword({
      email:    form.email,
      password: form.password
    })
    if (error) throw error
    navigateTo('/')
  } catch (error) {
    errorMessage.value = 'Er ging iets fout. Probeer het later opnieuw.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="sm:mx-auto sm:w-full sm:max-w-sm text-center">
    <img src="~/assets/images/logo.svg" alt="Logo" class="mx-auto h-12 w-auto">
    <h2 class="mt-10 text-3xl font-bold leading-9 tracking-tight mb-2">Welkom bij Lapzy</h2>
    <p class="text-muted-foreground">Jouw MX performance platform</p>
  </div>

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
            Inloggen
            <div v-if="loading" role="status" class="ml-2">
              <Loader2 class="size-5 animate-spin"/>
              <span class="sr-only">Aan het laden...</span>
            </div>
          </Button>
        </div>
      </form>
    </div>

<!--    <p class="mt-10 text-center text-sm text-muted-foreground">-->
<!--      Heb je geen account?-->
<!--      {{ ' ' }}-->
<!--      <Button variant="link" size="sm" class="px-0" as-child>-->
<!--        <NuxtLink to="/register">Meld je aan</NuxtLink>-->
<!--      </Button>-->
<!--    </p>-->
  </div>
</template>
