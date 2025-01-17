<script setup lang="ts">
import type {Database} from "~/types/supabase";
import {Loader2, Info} from "lucide-vue-next";

useSeoMeta({
  title: 'Profiel - Lapzy',
  description: 'Pas je profiel en app instellingen aan.'
})

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const notificationStore = useNotificationStore()

const loading = ref(false)
const loadingPassword = ref(false)
const emailChangeMessage = ref('')
const passwordChangeMessage = ref('')

const open = ref(false)

const {data: profile} = await useAsyncData('profile', async () => {
  try {
    const {data, error} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value?.id)
        .single()
    if (error) throw error
    return data
  } catch (error) {
    console.error(error)
  }
})

const {data: tracks} = await useLazyAsyncData('tracks', async () => {
  const {data, error} = await supabase
      .from('tracks')
      .select('id,name,location')
      .order('location', {ascending: true})
  if (error) throw error

  return data.map((track: any) => ({
    label: track.name || track.location,
    value: track.id.toString()
  }))
})

const {data: favoriteTracks} = await useAsyncData('profileFavoriteTracks', async () => {
  const {data: favoriteTrackIds, error: favoriteTracksError} = await supabase
      .from('favorite_tracks')
      .select('track_id')
      .eq('profile_id', user.value?.id)
      .single()
  if (favoriteTracksError) throw favoriteTracksError

  const {data, error} = await supabase
      .from('tracks')
      .select('id,name,location')
      .in('id', favoriteTrackIds.track_id)
  if (error) throw error

  return data.map((track: any) => track.id.toString())
})

const form = reactive({
  first_name: profile.value?.first_name || '',
  last_name: profile.value?.last_name || '',
  rider_number: profile.value?.rider_number || '',
  theme: profile.value?.theme || '220 76% 49%',
  favoriteTracks: favoriteTracks.value || [],
  email: user.value?.email || '',
  currentPassword: '',
  newPassword: '',
  repeatedPassword: '',
})

const themes = [
  {
    name: 'Blauw',
    value: '220 76% 49%'
  },
  {
    name: 'Oranje',
    value: '22 100% 50%'
  },
  {
    name: 'Groen',
    value: '94 65% 45%'
  },
  {
    name: 'Rood',
    value: '0 100% 40%'
  }
]

const setFavoriteTracks = (tracks: string[]) => {
  form.favoriteTracks = tracks
}

const themeBackground = (theme: string) => {
  return {
    'bg-blue-600': theme === '220 76% 49%',
    'bg-orange-500': theme === '22 100% 50%',
    'bg-lime-500': theme === '94 65% 45%',
    'bg-red-600': theme === '0 100% 40%',
  }
}

const onSubmit = async () => {
  if (!user.value) return

  try {
    loading.value = true
    const {error: profileError} = await supabase
        .from('profiles')
        .upsert({
          id: user.value.id,
          first_name: form.first_name,
          last_name: form.last_name,
          rider_number: parseInt(form.rider_number),
          theme: form.theme,
        })
    if (profileError) throw profileError

    const {error: favoriteTracksError} = await supabase
        .from('favorite_tracks')
        .upsert({
          profile_id: user.value.id,
          track_id: form.favoriteTracks,
        }, {onConflict: 'profile_id'})
    if (favoriteTracksError) throw favoriteTracksError

    if (user.value.email !== form.email) {
      const {error: userError} = await supabase.auth.updateUser({
        email: form.email,
      })
      if (userError) throw userError
      emailChangeMessage.value = 'Er is een e-mail verstuurd naar je nieuwe e-mailadres om deze te bevestigen.'
    }

    applyTheme(form.theme)
    notificationStore.createNotification({
      type: 'success',
      action: 'save',
      item: 'Profiel',
    })
  } catch (error) {
    console.error(error)
    notificationStore.createNotification({
      type: 'destructive',
      action: 'save',
      item: 'profiel',
    })
  } finally {
    loading.value = false
  }
}

const onPasswordSubmit = async () => {
  try {
    loadingPassword.value = true
    if (form.newPassword !== form.repeatedPassword) {
      passwordChangeMessage.value = 'De nieuwe wachtwoorden komen niet overeen.'
      return
    }
    const {data, error: verificationError} = await supabase.rpc('verify_password', {
      current_plain_password: form.currentPassword,
      current_id: user.value?.id
    })
    if (data === 'incorrect') {
      passwordChangeMessage.value = 'Het huidige wachtwoord is onjuist.'
      return
    }
    if (verificationError) throw verificationError
    const {error: updateError} = await supabase.auth.updateUser({
      password: form.newPassword,
    })
    if (updateError) throw updateError
    passwordChangeMessage.value = ''
    open.value = false
    notificationStore.createNotification({
      type: 'success',
      action: 'save',
      item: 'Wachtwoord',
    })
  } catch (error) {
    console.error(error)
  } finally {
    loadingPassword.value = false
  }
}

// Watch for changes on form.email
watch(form, () => {
  if (form.email !== user.value?.email) {
    emailChangeMessage.value = 'Er wordt een e-mail verstuurd naar je nieuwe e-mailadres om deze te bevestigen.'
  } else {
    emailChangeMessage.value = ''
  }
}, {deep: true})
</script>

<template>
  <h1 class="text-2xl sm:text-3xl font-semibold mb-8">Mijn profiel</h1>
  <form @submit.prevent="onSubmit" class="space-y-8">
    <section id="profile-settings" class="space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <Label for="first_name">Voornaam</Label>
          <Input
              v-model="form.first_name"
              id="first_name"
              name="first_name"
              type="text"
          />
        </div>
        <div>
          <Label for="last_name">Achternaam</Label>
          <Input
              v-model="form.last_name"
              id="last_name"
              name="last_name"
              type="text"
          />
        </div>
      </div>
      <div>
        <Label for="rider_number">Rijdersnummer</Label>
        <Input
            v-model="form.rider_number"
            id="rider_number"
            name="rider_number"
            type="number"
            class="w-24"
            min="1"
            max="9999"
        />
      </div>
    </section>

    <section id="app-settings" class="space-y-6">
      <h2 class="text-lg font-semibold">App instellingen</h2>
      <div>
        <Label class="block">Favoriete crossbanen</Label>
        <MultiSelect v-if="tracks" :options="tracks" :selectedOptions="favoriteTracks ?? []"
                     placeholder="Selecteer een crossbaan..." @itemToggled="setFavoriteTracks"/>
        <p v-else>Crossbanen ophalen mislukt.</p>
      </div>
      <div>
        <Label>Thema</Label>
        <div class="flex gap-x-3">
          <div v-for="theme in themes">
            <input type="radio" :id="theme.value" name="condition" v-model="form.theme" :value="theme.value"
                   class="hidden peer"/>
            <Label
                :for="theme.value"
                :class="cn('inline-flex items-center justify-center size-8 border border-input rounded-full cursor-pointer peer-checked:outline-none peer-checked:ring-2 peer-checked:ring-ring peer-checked:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', themeBackground(theme.value))"
            ></Label>
          </div>
        </div>
      </div>
    </section>

    <section id="account-settings">
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <Label for="email">E-mailadres</Label>
          <Input
              v-model="form.email"
              id="email"
              name="email"
              type="email"
          />
          <Alert v-if="emailChangeMessage" variant="info" class="mt-4">
            <Info class="size-4"/>
            <AlertDescription>{{ emailChangeMessage }}</AlertDescription>
          </Alert>
        </div>
        <div>
          <Label for="password">Wachtwoord</Label><br/>
          <div class="flex flex-col sm:flex-row gap-2">
            <input type="password" id="password" value="fake-password" class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" disabled/>
            <Dialog v-model:open="open">
              <DialogTrigger as-child>
                <Button variant="outline">Wachtwoord wijzigen</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader class="text-left">
                  <DialogTitle>Wachtwoord wijzigen</DialogTitle>
                </DialogHeader>
                <form @submit.prevent="onPasswordSubmit" class="space-y-4">
                  <div>
                    <Label for="current-password">Huidig wachtwoord</Label>
                    <PasswordInput
                        v-model="form.currentPassword"
                        id="current-password"
                        name="current-password"
                        required
                    />
                  </div>
                  <div>
                    <Label for="new-password">Nieuw wachtwoord</Label>
                    <PasswordInput
                        v-model="form.newPassword"
                        id="new-password"
                        name="new-password"
                        required
                    />
                  </div>
                  <div>
                    <Label for="repeated-password">Herhaal nieuw wachtwoord</Label>
                    <PasswordInput
                        v-model="form.repeatedPassword"
                        id="repeated-password"
                        name="repeated-password"
                        required
                    />
                  </div>

                  <p v-if="passwordChangeMessage" class="text-sm text-destructive">{{ passwordChangeMessage }}</p>

                  <Button class="w-full">
                    Opslaan
                  </Button>
                </form>

              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>

    <Button type="submit" class="w-full" :disabled="loading">
      <Loader2 v-if="loading" class="size-5 mr-2 animate-spin"/>
      Opslaan
    </Button>
  </form>
</template>

<style scoped>

</style>