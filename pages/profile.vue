<script setup lang="ts">
import type {Database} from "~/types/supabase";
import {Loader2} from "lucide-vue-next";

useSeoMeta({
  title: 'Profiel - Lapzy',
  description: 'Pas je profiel en app instellingen aan.'
})

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const notificationStore = useNotificationStore()

const loading = ref(false)

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

const {data: favoriteTracks} = await useAsyncData('favoriteTracks', async () => {
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
      item: 'Profiel',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <h1 class="text-2xl font-bold mb-8">Mijn profiel</h1>
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

    <Button type="submit" class="w-full" :disabled="loading">
      <Loader2 v-if="loading" class="size-5 mr-2 animate-spin"/>
      Opslaan
    </Button>
  </form>
</template>

<style scoped>

</style>