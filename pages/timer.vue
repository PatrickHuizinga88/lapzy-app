<script setup lang="ts">
import {Trophy} from 'lucide-vue-next'
import type {Database} from "~/types/supabase";
import Timer from "~/components/Timer.vue";
import type {Lap} from "~/types";
import { useWakeLock } from '@vueuse/core'

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()

const { track_id, condition } = useRoute().query

if (!track_id || !condition) {
  navigateTo('/')
}

const { request, isActive } = useWakeLock()

request("screen")

watch(() => isActive.value, (value) => console.log('Screen is locked:', value))

const { data: track, pending: pendingTrack } = await useAsyncData('track', async () => {
  if (!track_id) return
  const {data} = await supabase.from('tracks')
      .select('name,location')
      .eq('id', track_id)
      .single()
  return data
})

const saveSession = async (laps: Lap[], duration: string, note: string) => {
  if (!user.value) {
    navigateTo('/login')
    return
  }

  try {
    const { data: session, error: sessionError } = await supabase.from('sessions').insert({
      track_id: parseInt(track_id),
      user_id: user.value.id,
      condition: condition,
      duration: duration,
      note: note,
    }).select().single()
    if (sessionError) throw sessionError

    const { error: lapsError } = await supabase.from('lap_times').insert(laps.map(lap => ({
      session_id: session.id,
      time: lap.time,
    })))
    if (lapsError) throw lapsError

    navigateTo('/sessions')
  } catch (error) {
    console.error(error)
    alert('Sessie kan niet worden opgeslagen.')
  }
}

</script>

<template>
  <div class="flex flex-col h-full">
    <section v-if="track" class="flex flex-col items-center justify-center text-center h-32 shrink-0 space-y-1">
      <h1 v-if="!pendingTrack" class="text-2xl">{{ track?.name || track?.location }}</h1>
      <Skeleton v-if="pendingTrack" class="h-8 w-40" />
<!--      <div v-if="fastestLap" class="flex items-center justify-center gap-x-2 text-muted-foreground text-lg">-->
<!--        <Trophy class="size-5"/>-->
<!--        {{ fastestLap }}-->
<!--      </div>-->
    </section>

    <Timer :track="track?.name" @save="saveSession"/>

  </div>

</template>

<style scoped>

</style>