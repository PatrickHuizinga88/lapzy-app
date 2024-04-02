<script setup lang="ts">
import type {Database} from "~/types/supabase";

const { id } = useRoute().params
const supabase = useSupabaseClient<Database>()

const {data: session} = await useAsyncData('session', async () => {
  try {
    const { data: sessionDetails, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', id)
        .single()
    if (error) throw error

    console.log(sessionDetails)

    const { data: laps } = await supabase
        .from('lap_times')
        .select('*')
        .eq('session_id', id)
    if (error) throw error

    console.log(laps)
    return {
      ...sessionDetails,
      laps
    }
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <h1 class="text-center text-lg">Je sessie in <span class="block text-3xl font-semibold mt-2 mb-24">{{ session.track_id }}</span></h1>
  <h2 class="text-xl font-semibold text-center mb-4">Rondetijden</h2>
  <ol class="space-y-2">
    <li v-for="(lap, index) in session?.laps" class="flex items-center justify-between">
      <span class="inline-flex items-center justify-center bg-muted font-medium rounded text-muted-foreground size-6">{{ index + 1 }}</span>
      {{ lap.time }}
    </li>
  </ol>
</template>

<style scoped>

</style>