<script setup lang="ts">
import type {Database} from "~/types/supabase";
import { ArrowLeft } from 'lucide-vue-next';

definePageMeta({
  middleware: 'auth'
})

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
        .select('name, location')
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

const conditionBadgeClasses = computed(() => {
  if (!session.value) return
  switch (session.value.condition) {
    case 'GOOD':
      return 'bg-success/10 text-success border-success'
    case 'HEAVY':
      return 'bg-destructive/10 text-destructive border-destructive'
    case 'MEDIUM':
      return 'bg-warning/10 text-warning border-warning'
  }
})

useSeoMeta({
  title: `Je sessie in ${session.value?.track?.name || session.value?.track?.location} - Lapzy`,
  description: 'Bekijk je sessie terug.'
})
</script>

<template>
  <Button @click="$router.back()" variant="ghost" size="sm" class="text-muted-foreground mb-6 -ml-3">
    <ArrowLeft class="size-4 mr-2" />
    Terug
  </Button>

  <div class="space-y-10">
    <template v-if="session">
      <div>
        <h1 class="text-lg">Je sessie in <span class="block text-3xl font-semibold">{{ session.track.name || session.track.location }}</span></h1>
        <div class="flex items-center mt-2">
          <p class="text-muted-foreground">{{ $dayjs(session?.created_at).format('DD-MM-YYYY') }}</p>
          <div :class="['flex items-center h-6 text-xs border font-medium rounded px-1.5 ml-2', conditionBadgeClasses]">{{ trackCondition }}</div>
        </div>
      </div>

      <section id="stats" class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <StatCard class="w-full" title="Totale duur" :value="session.duration" />
          <StatCard class="w-full" title="Snelste ronde" :value="fastestLapTime" />
        </div>
      </section>

      <section id="lap-times">
        <h2 class="text-xl font-semibold mb-4">Rondetijden</h2>
        <ol class="space-y-3">
          <li v-for="(lap, index) in session?.laps" class="flex items-center justify-between gap-2">
            <span class="inline-flex items-center justify-center bg-muted font-medium rounded text-muted-foreground size-6">{{ index + 1 }}</span>
            <span class="tabular-nums">{{ lap.time }}</span>
          </li>
        </ol>
      </section>

      <section id="note">
        <h2 class="text-xl font-semibold mb-4">Notitie</h2>
        <p class="text-sm text-muted-foreground">{{ session?.note || 'Geen notitie toegevoegd' }}</p>
      </section>
    </template>

    <div v-else>
      <h1 class="text-lg">Sessie ophalen mislukt</h1>
    </div>
  </div>
</template>

<style scoped>

</style>