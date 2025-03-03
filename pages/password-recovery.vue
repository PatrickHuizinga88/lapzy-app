<script setup lang="ts">
import {Loader2} from 'lucide-vue-next'

definePageMeta({
  layout: false,
  middleware: 'is-authenticated'
})

const supabase = useSupabaseClient()
const notificationStore = useNotificationStore()

const email = ref('')
const success = ref(false)
const loading = ref(false)

const resetPassword = async () => {
  try {
    loading.value = true
    const {public: {baseUrl}} = useRuntimeConfig()
    const {error} = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${baseUrl}/update-password`,
    })

    if (error) {
      notificationStore.createNotification({
        type: 'destructive',
        isError: true,
      })
      console.error(error)
      return
    }

    success.value = true
  } catch (error) {
    notificationStore.createNotification({
      type: 'destructive',
      isError: true,
    })
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <NuxtLayout name="auth" :title="$t('authentication.password_recovery.reset_your_password')" description="Vul het e-mailadres in van je Lapzy account om het wachtwoord te herstellen.">
    <div class="sm:mt-6 md:mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-background px-6 py-10 sm:shadow-xl sm:rounded-xl sm:px-10">
        <form v-if="!success" class="space-y-6" @submit.prevent="resetPassword">
          <div>
            <Label for="email" class="block text-sm font-medium leading-6">{{ $t('common.general.email') }}</Label>
            <div class="mt-2">
              <Input
                  v-model="email"
                  id="email"
                  name="email"
                  type="email"
                  required/>
            </div>
          </div>

          <Button type="submit" :disabled="loading" class="w-full">
            <div v-if="loading" role="status">
              <Loader2 class="size-5 animate-spin"/>
              <span class="sr-only">{{ $t('common.general.loading') }}...</span>
            </div>
            {{ $t('authentication.password_recovery.reset_password') }}
          </Button>
        </form>

        <p v-else class="text-center">
          {{ $t('authentication.password_recovery.password_reset_email_sent') }} <strong>{{ email }}</strong>.
        </p>
      </div>

      <div class="flex justify-center sm:mt-6 md:mt-10">
        <Button variant="link" class="p-0" as-child>
          <NuxtLink to="/login">
            {{ $t('authentication.password_recovery.back_to_sign_in') }}
          </NuxtLink>
        </Button>
      </div>
    </div>
  </NuxtLayout>
</template>
