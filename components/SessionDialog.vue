<script setup lang="ts">
import {MapPin, Loader2} from "lucide-vue-next";
import type {Database} from "~/types/supabase";
import type {Track} from "~/types";
import {useGeolocation} from "@vueuse/core";

const supabase = useSupabaseClient<Database>()

const featuredTracks = [
  {
    id: 1,
    name: "MCO Oirschot",
    location: "Oirschot"
  },
  {
    id: 2,
    name: "MAC Budel",
    location: "Budel"
  },
  {
    id: 4,
    name: "De Landsard",
    location: "Veldhoven"
  },
]

const { data: tracks } = await useAsyncData('tracks', async () => {
  const { data, error } = await supabase
      .from('tracks')
      .select('id, name, location')
      .order('location', {ascending: true})
  if (error) throw error
  return data.filter(track => !featuredTracks.some(featuredTrack => featuredTrack.id === track.id))
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

const selectedTrack = ref<number | undefined>(undefined)
const selectedCondition = ref('MEDIUM')
const formError = ref('')
const locationError = ref('')
const open = ref(false)
const trackSelect = ref(null)

const { data: nearbyTrack, pending, execute } = await useAsyncData('nearbyTrack', async () => {
  if (!coords.value) return
  console.log(coords.value.latitude, coords.value.longitude)
  const { data, error } = await supabase.rpc('closest_track', {
    lat: coords.value.latitude,
    long: coords.value.longitude,
  }).limit(1).single()
  if (error) throw error
  if (data.dist_meters > 1000) {
    locationError.value = 'Geen baan gevonden in de buurt'
    if (trackSelect.value) trackSelect.value.focus()
    return
  }
  selectedTrack.value = data.id.toString()
  return data
}, {
  immediate: false,
})

const { coords, error: geoError } = useGeolocation()

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
<!--                <span class="text-sm opacity-60 font-normal">{{ track.location }}</span>-->
<!--              </div>-->

<!--              <Star class="size-5 text-yellow-400"/>-->
<!--            </label>-->
<!--          </div>-->
<!--          {{ nearbyTrack }}-->
<!--          {{ coordinates?.latitude + ', ' + coordinates?.longitude }}-->
          <Button @click="execute" type="button" variant="secondary">
            Locatie ophalen
<!--            <Loader2 v-if="pending" class="size-5 ml-2.5 animate-spin" />-->
            <MapPin class="size-5 ml-2.5" />
          </Button>
          <p class="text-red-500 text-sm">{{ locationError }}</p>

          <Select v-if="tracks" v-model="selectedTrack">
            <SelectTrigger ref="trackSelect">
              <SelectValue placeholder="Handmatig selecteren" />
            </SelectTrigger>
            <SelectContent>
<!--              <SelectGroup>-->
<!--                <SelectLabel>Uitgelichte banen</SelectLabel>-->
<!--                <SelectItem v-for="track in tracks" :value="track.id.toString()">{{track.name}} <span v-if="track.location" class="text-muted-foreground">- {{ track.location }}</span></SelectItem>-->
<!--              </SelectGroup>-->
<!--              <SelectGroup>-->
<!--                <SelectLabel>Andere banen</SelectLabel>-->
                <SelectItem v-for="track in tracks" :value="track.id.toString()">
                  {{track.location}} <span v-if="track.location" class="text-muted-foreground">- {{ track.name }}</span>
                </SelectItem>
<!--              </SelectGroup>-->
            </SelectContent>
          </Select>
        </div>

        <div>
          <label class="inline-block mb-3">Hoe ligt de baan?</label>
          <div class="grid grid-cols-3 gap-x-3">
            <div v-for="condition in conditions">
              <input type="radio" :id="condition.value" name="condition" v-model="selectedCondition" :value="condition.value" class="hidden peer" />
              <Label
                  :for="condition.value"
                  class="inline-flex items-center justify-center w-full px-4 py-3 bg-background border border-input rounded-lg cursor-pointer peer-checked:border-primary peer-checked:text-primary peer-checked:bg-primary/10 hover:bg-muted"
              >
                {{ condition.name }}
              </Label>
            </div>
          </div>
        </div>

        <p v-if="formError" class="text-red-500 text-sm">{{ formError }}</p>

        <Button type="submit" size="lg" class="w-full">Start sessie</Button>
      </form>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>