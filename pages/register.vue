<script setup lang="ts">
import {Loader2, CheckCircle} from "lucide-vue-next";
import {Input} from "~/components/ui/input";
import {PasswordInput} from "~/components/ui/password-input";
import {Alert, AlertDescription, AlertTitle} from "~/components/ui/alert";

definePageMeta({
  layout: false,
  middleware: 'is-authenticated'
})

useSeoMeta({
  title: 'Registreren - Lapzy',
  description: 'Maak eenvoudig een account aan om te beginnen.'
})

const supabase = useSupabaseClient()
const {t} = useI18n()

const form = reactive({
  email: '',
  password: '',
  repeatedPassword: ''
})
const errorMessage = ref('')
const loading = ref(false)
const success = ref(false)
const {public: {baseUrl}} = useRuntimeConfig()

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
        emailRedirectTo: `${baseUrl}/confirm-registration`
      }
    })
    if (error) throw error
    success.value = true
  } catch (error) {
    errorMessage.value = t('authentication.register.sign_up_failed')
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <NuxtLayout name="auth" :title="$t('authentication.register.sign_up')" description="Begin jouw avontuur naar betere prestaties.">
    <div class="sm:mt-6 md:mt-10 sm:mx-auto w-full sm:max-w-[480px]">
      <div class="bg-background px-6 py-10 sm:shadow-xl sm:rounded-xl sm:px-10">
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
            <PasswordInput
                v-model="form.password"
                id="password"
                name="password"
                required/>
          </div>

          <div>
            <Label for="repeat-password">Herhaal je wachtwoord</Label>
            <PasswordInput
                v-model="form.repeatedPassword"
                id="repeat-password"
                name="repeat-password"
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

          <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>

        </form>

        <div v-else class="flex flex-col items-center">
          <Alert variant="success">
            <CheckCircle class="size-4"/>
            <AlertTitle>Registratie gelukt!</AlertTitle>
            <AlertDescription>Je ontvangt een e-mail om je account te activeren.</AlertDescription>
          </Alert>

          <p class="text-sm text-muted-foreground mt-4">
            Niks ontvangen?
            <Button @click="signUp" variant="link" class="h-auto p-0 text-primary">Verstuur opnieuw</Button>
          </p>
        </div>
      </div>

      <p class="sm:mt-6 md:mt-10 text-center text-sm text-muted-foreground">
        Heb je al een account?
        {{ ' ' }}
        <Button variant="link" size="sm" class="px-0" as-child>
          <NuxtLink to="/login">Log in</NuxtLink>
        </Button>
      </p>
    </div>
  </NuxtLayout>
</template>
