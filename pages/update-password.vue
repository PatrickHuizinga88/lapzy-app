<script setup lang="ts">
import { ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

definePageMeta({
  layout: 'authentication'
})

const supabase = useSupabaseClient()
const notificationStore = useNotificationStore()
const { t } = useI18n()

const newPassword = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const loading = ref(false)

const updatePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = t('authentication.password_recovery.passwords_dont_match')
    return
  }
  errorMessage.value = ''

  try {
    loading.value = true
    const { error } = await supabase.auth.updateUser({
      password: newPassword.value
    })

    if (error) {
      notificationStore.createNotification({
        type: 'destructive',
        isError: true,
      })
      console.error(error)
      return
    }

    notificationStore.createNotification({
      type: 'success',
      action: 'update',
      item: t('authentication.common.password'),
    })
    navigateTo('/login')
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
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <img src="~/assets/images/logo.svg" alt="Logo" class="mx-auto h-12 w-auto">
    <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">{{ t('authentication.password_recovery.reset_your_password') }}</h2>
  </div>

  <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
    <div class="bg-background border px-6 py-12 shadow-[0_10px_50px_-15px] shadow-primary/25 sm:rounded-xl sm:px-12">
      <form class="space-y-6" @submit.prevent="updatePassword">
        <div>
          <Label for="new-password" class="block text-sm font-medium leading-6">{{ t('authentication.password_recovery.new_password') }}</Label>
          <div class="mt-2">
            <PasswordInput
                v-model="newPassword"
                id="new-password"
                name="new-password"
                required />
          </div>
        </div>

        <div>
          <Label for="confirm-password" class="block text-sm font-medium leading-6">{{ t('authentication.password_recovery.confirm_password') }}</Label>
          <div class="mt-2">
            <PasswordInput
                v-model="confirmPassword"
                id="confirm-password"
                name="confirm-password"
                required />
          </div>
        </div>

        <Button type="submit" :disabled="loading" class="w-full">
          <div v-if="loading" role="status">
            <Loader2 class="size-5 animate-spin"/>
            <span class="sr-only">{{ t('common.general.loading') }}...</span>
          </div>
          {{ t('authentication.password_recovery.update_password') }}
        </Button>

        <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>
