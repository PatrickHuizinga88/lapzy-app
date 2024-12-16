<script setup lang="ts">
import {Loader2} from "lucide-vue-next";
import {Input} from "~/components/ui/input";

definePageMeta({
  layout: 'auth'
})

useSeoMeta({
  title: 'Registreren - Lapzy',
  description: 'Maak eenvoudig een account aan om te beginnen.'
})

const supabase = useSupabaseClient()

const form = reactive({
  email: '',
  password: '',
  repeatedPassword: ''
})
const errorMessage = ref('')
const loading = ref(false)
const success = ref(false)
const {baseUrl}: { baseUrl: string } = useRuntimeConfig()

const signUp = async () => {
  if (form.password !== form.repeatedPassword) {
    errorMessage.value = 'Wachtwoorden komen niet overeen.'
    return
  }

  try {
    loading.value = true
    const {error} = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: baseUrl
      }
    })
    if (error) {
      loading.value = false
      throw error
    }
    success.value = true
  } catch (error) {
    errorMessage.value = 'Er ging iets fout. Probeer het later opnieuw.'
  }
}
</script>

<template>
  <div class="mt-10 sm:mx-auto w-full sm:max-w-[480px]">
    <div class="bg-background px-6 py-12 sm:shadow-xl sm:rounded-xl sm:px-12">
      <form v-if="!success" class="space-y-6" @submit.prevent="signUp">
        <div>
          <Label for="email">E-mailadres</Label>
          <Input
              v-model="form.email"
              id="email"
              name="email"
              type="email"
              required/>
        </div>

        <div>
          <Label for="password">Wachtwoord</Label>
          <Input
              v-model="form.password"
              id="password"
              name="password"
              type="password"
              required/>
        </div>

        <div>
          <Label for="repeat-password">Herhaal je wachtwoord</Label>
          <Input
              v-model="form.repeatedPassword"
              id="repeat-password"
              name="password"
              type="password"
              required/>
        </div>

        <div>
          <Button type="submit" :disabled="loading" class="w-full">
            <div v-if="loading" role="status" class="mr-2">
              <Loader2 class="size-5 animate-spin"/>
              <span class="sr-only">Aan het laden...</span>
            </div>
            Registreren
          </Button>
        </div>

        <p class="text-sm text-destructive">{{ errorMessage }}</p>

      </form>

      <div v-else>
        <p class="text-center text-lg font-semibold">Registratie gelukt!</p>
        <p class="text-center text-muted-foreground">Je ontvangt een e-mail om je account te activeren.</p>
      </div>
    </div>

    <p class="mt-10 text-center text-sm text-muted-foreground">
      Heb je al een account?
      {{ ' ' }}
      <Button variant="link" size="sm" class="px-0" as-child>
        <NuxtLink to="/login">Log in</NuxtLink>
      </Button>
    </p>
  </div>
</template>
