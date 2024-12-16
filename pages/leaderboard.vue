<script setup lang="ts">
import type {Database} from "~/types/supabase";

useSeoMeta({
  title: 'Scorebord - Lapzy',
  description: 'Vergelijk jouw rondetijden met die van anderen.'
})

definePageMeta({
  middleware: 'auth'
})

const supabase = useSupabaseClient<Database>()

const { data: tracks, status } = await useLazyAsyncData('tracks', async () => {
  const { data, error } = await supabase
      .from('tracks')
      .select('id,name,location')
      .order('location', {ascending: true})
  if (error) throw error
  return data
})

const selectedTrack = ref<string | undefined>(undefined)

const { data: lapTimes } = await useAsyncData('fastestLap', async () => {
  const { data, error } = await supabase
      .from('sessions')
      .select('best_lap(time),user_id')
      .eq('track_id', parseInt(selectedTrack.value))
  if (error) throw error

  return data

}, {
  immediate: false,
  watch: [selectedTrack]
})
</script>

<template>
  <h1 class="text-2xl sm:text-3xl font-semibold mb-6">Scorebord</h1>
  <Select v-model="selectedTrack" :disabled="status === 'pending'">
    <SelectTrigger>
      <SelectValue placeholder="Selecteer een baan" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="track in tracks" :value="track.id.toString()">
        {{  track.name || track.location }}
      </SelectItem>
    </SelectContent>
  </Select>

  <section class="py-8">
    <ol v-if="lapTimes?.length">
      <li v-for="(lap, index) in lapTimes" class="flex items-center gap-x-4 odd:bg-muted rounded-lg px-4 py-2">
        <div class="flex items-center justify-center text-primary font-semibold text-lg rounded-md">{{ index + 1 }}</div>
        <div class="text-lg">
          <div class="text-sm font-medium truncate max-w-[200px]">{{ lap.user_id }}</div>
          {{ lap.best_lap.time }}
        </div>
      </li>
    </ol>
    <p v-else-if="selectedTrack" class="text-sm text-muted-foreground">Geen rondetijden gevonden</p>
  </section>

</template>

<style scoped>

</style>