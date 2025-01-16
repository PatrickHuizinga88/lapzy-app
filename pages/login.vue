<script setup lang="ts">
import {Loader2} from "lucide-vue-next";
import {Input} from "~/components/ui/input";
import {PasswordInput} from "~/components/ui/password-input";

definePageMeta({
  layout: false,
  middleware: 'is-authenticated'
})

useSeoMeta({
  title: 'Inloggen - Lapzy',
  description: 'Log in met je account om aan de slag te gaan.'
})

const supabase = useSupabaseClient()
const {t} = useI18n()

const form = reactive({
  email: '',
  password: ''
})
const errorMessage = ref('')
const loading = ref(false)

const signIn = async () => {
  try {
    loading.value = true
    const {data, error} = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    })
    if (error) {
      loading.value = false
      throw error
    }
    if (data.user.last_sign_in_at) {
      navigateTo('/')
      return
    }
    navigateTo('/intro')
  } catch (error) {
    errorMessage.value = t('authentication.login.sign_in_failed')
    console.error(error)
  }
}
</script>

<template>
  <NuxtLayout name="auth" :title="$t('authentication.common.sign_in')" description="Jouw MX performance platform.">
    <div class="sm:mt-6 md:mt-10 sm:mx-auto w-full sm:max-w-[480px]">
      <div class="bg-background px-6 py-10 sm:shadow-xl sm:rounded-xl sm:px-10">
        <form class="space-y-6" @submit.prevent="signIn">
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
            <div class="flex items-center justify-between">
              <Label for="password">Wachtwoord</Label>
              <Button variant="link" size="sm" class="h-auto p-0 mb-2" as-child>
                <NuxtLink to="/password-recovery">Wachtwoord vergeten?</NuxtLink>
              </Button>
            </div>
            <PasswordInput
                v-model="form.password"
                id="password"
                name="password"
                required/>
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

          <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>

        </form>
      </div>

      <p class="sm:mt-6 md:mt-10 text-center text-sm text-muted-foreground">
        Heb je geen account?
        {{ ' ' }}
        <Button variant="link" size="sm" class="px-0" as-child>
          <NuxtLink to="/register">Registreer nu</NuxtLink>
        </Button>
      </p>
    </div>
  </NuxtLayout>
</template>
