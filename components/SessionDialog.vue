<script setup lang="ts">
import {MapPin, Star, Loader2} from "lucide-vue-next";
import type {Database} from "~/types/supabase";
import {useGeolocation} from "@vueuse/core";

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()

const { data: favoriteTracks } = await useAsyncData('favoriteTracks', async () => {
  const { data: favoriteTrackIds, error: favoriteTracksError } = await supabase
      .from('favorite_tracks')
      .select('track_id')
      .eq('profile_id', user.value.id)
      .single()
  if (favoriteTracksError) throw favoriteTracksError

  const { data, error } = await supabase
      .from('tracks')
      .select('id,name,location')
      .in('id', favoriteTrackIds.track_id)
  if (error) throw error

  return data
})

const { data: filteredTracks } = useAsyncData('filteredTracks', async () => {
  const { data, error } = await supabase
      .from('tracks')
      .select('id, name, location')
      .order('location', {ascending: true})
  if (error) throw error
  return data.filter(track => !favoriteTracks.value.some(featuredTrack => featuredTrack.id === track.id))
})

const conditions = [
  {
    value: "GOOD",
    name: "Perfect",
  },
  {
    value: "MEDIUM",
    name: "Ingereden",
  },
  {
    value: "HEAVY",
    name: "Zwaar",
  },
]

const selectedTrack = ref<string | undefined>(undefined)
const selectedCondition = ref('MEDIUM')
const formError = ref('')
const locationError = ref('')
const open = ref(false)
const trackSelect = ref(null)
const coordinates = ref(null)
const loadingLocation = ref(false)

const getLocation = async () => {
  locationError.value = ''
  loadingLocation.value = true

  try {
    coordinates.value = await getCoords()
    await execute()
  } catch {
    locationError.value = 'Locatie kan niet worden opgehaald'
  } finally {
    loadingLocation.value = false
  }
}

const getCoords = async () => {
  const { coords } = useGeolocation()
  return new Promise((resolve, reject) => {
    watch(coords, (newCoords) => {
      if (newCoords && newCoords.latitude !== Infinity && newCoords.longitude !== Infinity) {
        resolve(newCoords)
      }
    }, { immediate: true })
    setTimeout(() => reject(
      new Error('Location not found')
    ), 10000)
  })
}

const { execute } = await useAsyncData('nearbyTrack', async () => {
  const { data, error } = await supabase.rpc('closest_track', {
    lat: coordinates.value.latitude,
    long: coordinates.value.longitude,
  }).limit(1).single()
  if (error) throw error
  if (data.dist_meters > 1000) {
    locationError.value = 'Geen baan gevonden in de buurt. Graag handmatig selecteren'
    if (trackSelect.value) trackSelect.value.focus()
    return
  }
  selectedTrack.value = data.id.toString()
  locationError.value = ''
  return data
}, {
  immediate: false,
})

const handleSubmit = () => {
  if (selectedTrack.value === undefined) {
    formError.value = 'Selecteer een baan'
    return
  }

  navigateTo({
    path: '/timer',
    query: {
      track_id: selectedTrack.value,
      condition: selectedCondition.value,
    }
  })

  open.value = false
  selectedTrack.value = undefined
  selectedCondition.value = 'MEDIUM'
  formError.value = ''
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent aria-describedby="Stel de baan en status van de sessie in.">
      <DialogTitle>
        <h3 class="text-lg font-semibold">Sessie instellen</h3>
      </DialogTitle>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-y-2">
<!--          <div v-for="track in featuredTracks">-->
<!--            <input type="radio" :id="track.id.toString()" name="selected-track" v-model="selectedTrack" :value="track.id" class="hidden peer" />-->
<!--            <label-->
<!--                :for="track.id.toString()"-->
<!--                class="inline-flex items-center justify-between w-full px-4 py-2 bg-background border border-input rounded-lg cursor-pointer peer-checked:border-primary peer-checked:text-primary peer-checked:bg-primary/10 hover:bg-muted"-->
<!--            >-->
<!--              <div class="flex flex-col font-medium">-->
<!--                {{ track.name }}-->
<!--                <span class="text-sm opacity-60 font-normal">{{  track.location }}</span>-->
<!--              </div>-->

<!--              <Star class="size-5 text-yellow-400"/>-->
<!--            </label>-->
<!--          </div>-->
          <Button @click="getLocation" type="button" variant="secondary" :disabled="loadingLocation">
            <Loader2 v-if="loadingLocation" class="size-5 mr-2 animate-spin" />
            <MapPin v-else class="size-5 mr-2" />
            Locatie ophalen
          </Button>

          <p v-if="locationError" class="text-red-500 text-sm">{{ locationError }}</p>

          <Select v-if="filteredTracks" v-model="selectedTrack">
            <SelectTrigger ref="trackSelect">
              <SelectValue placeholder="Handmatig selecteren" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>
                  <div class="flex items-center -ml-6">
                    <Star class="text-yellow-500 fill-yellow-500 size-4 mr-2"/>
                    Favoriete banen
                  </div>
                </SelectLabel>
                <SelectItem v-for="track in favoriteTracks" :value="track.id.toString()">
                  {{track.name }}

                  <span :class="{'text-muted-foreground': track.name}" v-if="track.location">
                    <template v-if="track.name">
                    -
                    </template>
                    {{ track.location }}
                  </span>
                </SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Andere banen</SelectLabel>
                <SelectItem v-for="track in filteredTracks" :value="track.id.toString()">
                  {{track.name }}

                  <span :class="{'text-muted-foreground': track.name}" v-if="track.location">
                    <template v-if="track.name">
                    -
                    </template>
                    {{ track.location }}
                  </span>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <fieldset aria-label="Selecteer een baanconditie">
            <Label class="inline-block mb-3">Hoe ligt de baan?</Label>
            <div class="grid grid-cols-3 gap-x-3">
              <div v-for="condition in conditions" class="relative">
                <input type="radio" :id="condition.value" name="condition" v-model="selectedCondition" :value="condition.value" class="opacity-0 absolute peer" />
                <Label
                    :for="condition.value"
                    class="inline-flex items-center justify-center w-full px-4 py-3 bg-background border border-input rounded-lg cursor-pointer peer-checked:border-primary peer-checked:text-primary peer-checked:bg-primary/10 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 hover:bg-muted"
                >
                  {{ condition.name }}
                </Label>
              </div>
            </div>
          </fieldset>
        </div>

        <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>

        <Button type="submit" size="lg" class="w-full">Start sessie</Button>
      </form>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>