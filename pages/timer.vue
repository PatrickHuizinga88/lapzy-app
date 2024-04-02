<script setup lang="ts">
import {Trophy} from 'lucide-vue-next'
import type {Database} from "~/types/supabase";

interface Lap {
  time: string,
  duration: string
}

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()

const { track_id, condition } = useRoute().query

const { data: track, pending: pendingTrack } = await useAsyncData('track', async () => {
  if (!track_id) return
  const { data } = await supabase.from('tracks')
      .select('name')
      .eq('id', track_id)
      .single()
  return data
})

const laps = ref<Lap[]>([])

const time = ref({
  min: '00',
  sec: '00',
  ms: '00',
})

const timerStart = ref<Date>()
const timerStop = ref<Date>()
const pauseDuration = ref(0)
const timerInterval = ref<any>(null)
const timerRunning = ref(false)

const start = () => {
  timerStart.value = new Date()
  timerInterval.value = setInterval(clockRunning, 50)
  timerRunning.value = true
}

const setLap = async () => {
  if (!timerStart.value) return

  const currentTime = Date.now()
  const timeElapsed = timerStart.value ? new Date(currentTime - timerStart.value.getTime() - pauseDuration.value) : new Date()

  const min = timeElapsed.getUTCMinutes()
  const sec = timeElapsed.getUTCSeconds()
  const ms = Math.floor(timeElapsed.getUTCMilliseconds() / 10)

  const duration = `${zeroPrefix(min, 2)}:${zeroPrefix(sec, 2)}.${zeroPrefix(ms, 2)}`

  laps.value.push({
    time: totalTime.value,
    duration: duration
  })
  reset()
  start()
}

const resume = () => {
  if (!timerStop.value) return
  pauseDuration.value += (new Date().getTime() - timerStop.value.getTime())
  timerInterval.value = setInterval(clockRunning, 50)
  timerRunning.value = true
}

const stop = () => {
  timerRunning.value = false
  timerStop.value = new Date()
  clearInterval(timerInterval.value)
}

const clockRunning = () => {
  if (!timerStart.value) return
  const currentTime = Date.now()
  const timeElapsed = timerStart.value ? new Date(currentTime - timerStart.value.getTime() - pauseDuration.value) : new Date()
  const min = timeElapsed.getUTCMinutes()
  const sec = timeElapsed.getUTCSeconds()
  const ms = Math.floor(timeElapsed.getUTCMilliseconds() / 10)

  time.value = {
    min: zeroPrefix(min, 2),
    sec: zeroPrefix(sec, 2),
    ms: zeroPrefix(ms, 2),
  }
}

const zeroPrefix = (num: number, digit: number) => {
  return (Array(digit).join('0') + num).slice(-digit)
}

const totalTime = computed(() => {
  return `${time.value.min}:${time.value.sec}.${time.value.ms}`
})

const reset = () => {
  timerRunning.value = false
  clearInterval(timerInterval.value)
  pauseDuration.value = 0
  timerStart.value = undefined
  timerStop.value = undefined

  time.value = {
    min: '00',
    sec: '00',
    ms: '00',
  }
}

const isBestLap = (lapTime: string) => {
  if (!laps.value.length) return false
  const bestLap = laps.value.reduce((prev, current) => (prev.time < current.time) ? prev : current)
  return bestLap.time === lapTime
}

const discardSession = () => {
  reset()
  laps.value = []
}

const saveSession = async () => {
  if (!user.value) {
    navigateTo('/login')
    return
  }

  try {
    const { data: session, error: sessionError } = await supabase.from('sessions').insert({
      track_id: parseInt(track_id),
      user_id: user.value.id,
      condition: condition,
    }).select().single()
    if (sessionError) throw sessionError

    console.log(session)

    const { error: lapsError } = await supabase.from('lap_times').insert(laps.value.map(lap => ({
      session_id: session.id,
      time: lap.time,
    })))
    if (lapsError) throw lapsError

    alert('Sessie opgeslagen!')
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
      <h1 v-if="!pendingTrack" class="text-2xl">{{ track?.name }}</h1>
      <Skeleton v-if="pendingTrack" class="h-8 w-40" />
<!--      <div v-if="fastestLap" class="flex items-center justify-center gap-x-2 text-muted-foreground text-lg">-->
<!--        <Trophy class="size-5"/>-->
<!--        {{ fastestLap }}-->
<!--      </div>-->
    </section>

    <section class="flex items-center justify-center h-full">
      <div class="flex items-center justify-center text-5xl font-medium *:text-center">
        <span class="w-16">{{ time.min }}</span>
        :
        <span class="w-16">{{ time.sec }}</span>
        .
        <span class="w-16">{{ time.ms }}</span>
      </div>
    </section>

    <div class="mt-auto">
      <section v-if="laps.length" class="mt-auto mb-8">
        <div class="overflow-y-auto h-48 -mr-2">
          <ol class="flex flex-col-reverse justify-end gap-y-2">
            <li v-for="(lap, index) in laps" :key="index" class="flex justify-between items-center text-sm pr-2">
              <span class="inline-flex items-center justify-center bg-muted font-medium rounded text-muted-foreground size-6">{{ index + 1 }}</span>
              <span :class="{'text-indigo-500 font-medium': isBestLap(lap.time)}">{{ lap.time }}</span>
              <!--          <span class="text-right">{{ lap.duration }}</span>-->
            </li>
          </ol>
        </div>
      </section>

      <section>
        <div class="grid grid-cols-2 gap-x-6">
          <Button v-if="!timerStart" size="xl" class="col-span-full" @click="start">Start</Button>
          <template v-else-if="timerRunning">
            <Button variant="secondary" size="xl" @click="setLap">Ronde</Button>
            <Button variant="destructive" size="xl" @click="stop">Stop</Button>
          </template>
          <template v-else-if="timerStop">
            <Dialog>
              <DialogTrigger as-child>
                <Button variant="secondary" size="xl">Afronden</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Jouw sessie in {{ track?.name }}</DialogTitle>
                <div>
                  Totale duur
                  <div class="text-2xl font-medium">-</div>
                </div>
                <div>
                  Beste rondetijd
                  <div class="text-2xl font-medium">-</div>
                </div>
                <DialogFooter class="gap-y-2">
                  <Button variant="secondary" @click="discardSession">Verwijderen</Button>
                  <Button @click="saveSession">Opslaan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button size="xl" @click="resume">Hervatten</Button>
          </template>
        </div>
      </section>
    </div>
  </div>



</template>

<style scoped>

</style>