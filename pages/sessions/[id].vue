<script setup lang="ts">
import type {Database} from "~/types/supabase";
import { ArrowLeft } from 'lucide-vue-next';

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

    const { data: track } = await supabase
        .from('tracks')
        .select('name')
        .eq('id', sessionDetails.track_id)
        .single()

    const { data: laps } = await supabase
        .from('lap_times')
        .select('*')
        .eq('session_id', id)

    return {
      ...sessionDetails,
      track,
      laps
    }
  } catch (error) {
    console.error(error)
  }
})

const fastestLapTime = computed(() => {
  if (!session.value) return
  const fastestLap = session.value.laps.reduce((prev, current) => (prev.time < current.time) ? prev : current)
  return fastestLap.time
})

const trackCondition = computed(() => {
  if (!session.value) return
  switch (session.value.condition) {
    case 'GOOD':
      return 'Perfect'
    case 'HEAVY':
      return 'Zwaar'
    case 'MEDIUM':
      return 'Ingereden'
  }
})
</script>

<template>
  <Button @click="$router.back()" variant="ghost" size="sm" class="text-muted-foreground mb-6 -ml-3">
    <ArrowLeft class="size-4 mr-2" />
    Terug
  </Button>

  <div class="space-y-12 text-center">
    <div>
      <h1 class="text-lg">Je sessie in <span class="block text-3xl font-semibold my-2">{{ session?.track.name }}</span></h1>
      <p class="text-muted-foreground">{{ $dayjs(session?.created_at).format('DD-MM-YYYY') }}</p>
    </div>

    <section id="stats" class="space-y-3">
      <StatCard class="w-full" title="Snelste ronde" :value="fastestLapTime" />

      <div class="grid grid-cols-2 gap-3">
        <StatCard class="w-full" title="Totale duur" :value="session?.duration" />
        <StatCard class="w-full" title="Baanconditie" :value="trackCondition" />
      </div>
    </section>

    <section id="lap-times">
      <h2 class="text-xl font-semibold mb-4">Rondetijden</h2>
      <ol class="space-y-3">
        <li v-for="(lap, index) in session?.laps" class="flex items-center justify-between">
          <span class="inline-flex items-center justify-center bg-primary/15 font-medium rounded text-primary size-6 mr-2">{{ index + 1 }}</span>
          {{ lap.time }}
        </li>
      </ol>
    </section>

    <section id="note">
      <h2 class="text-xl font-semibold mb-4">Notitie</h2>
      <p class="text-sm text-muted-foreground">{{ session?.note || 'Geen notitie toegevoegd' }}</p>
    </section>
  </div>
</template>

<style scoped>

</style>