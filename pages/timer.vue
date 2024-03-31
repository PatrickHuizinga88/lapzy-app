<script setup lang="ts">
import {Trophy} from 'lucide-vue-next'

interface Laps {
  time: string,
  totalTime?: string
}

const supabase = useSupabaseClient()
const user = useSupabaseUser()

onMounted(() => {
  const { track, condition } = useRoute().query

  if (track) trackId.value = parseInt(track as string)
  if (condition) trackCondition.value = condition
})

const trackId = ref<number | undefined>(undefined)
const trackCondition = ref<string | undefined>(undefined)

let laps: Laps[] = []

const time = ref({
  total: '00:00.00',
  min: '00',
  sec: '00',
  ms: '00',
})

const timerStart = ref<Date | null>(null)
const timerStop = ref<Date | null>(null)
const pauseDuration = ref(0)
const timerInterval = ref<any>(null)
const timerRunning = ref(false)

const start = () => {
  timerStart.value = new Date()

  // TODO: Fix this messing up the timer
  if (timerStop.value !== null) {
    pauseDuration.value += (new Date().getTime() - timerStop.value.getTime())
  }

  timerInterval.value = setInterval(clockRunning, 50)
  timerRunning.value = true
}

const setLap = () => {
  laps.push({
    time: time.value.total,
    totalTime: new Date().toISOString()
  })
  timerStart.value = new Date()
  time.value = {
    total: '00:00.00',
    min: '00',
    sec: '00',
    ms: '00',
  }
}

const stop = () => {
  timerRunning.value = false
  timerStop.value = new Date()
  clearInterval(timerInterval.value)
}

const clockRunning = () => {
  const currentTime = Date.now()
  const timeElapsed = timerStart.value ? new Date(currentTime - timerStart.value.getTime() - pauseDuration.value) : new Date()
  const min = timeElapsed.getUTCMinutes()
  const sec = timeElapsed.getUTCSeconds()
  const ms = Math.floor(timeElapsed.getUTCMilliseconds() / 10)

  time.value = {
    total: zeroPrefix(min, 2) + ':' + zeroPrefix(sec, 2) + '.' + zeroPrefix(ms, 2),
    min: zeroPrefix(min, 2),
    sec: zeroPrefix(sec, 2),
    ms: zeroPrefix(ms, 2),
  }
}

const zeroPrefix = (num: number, digit: number) => {
  return (Array(digit).join('0') + num).slice(-digit)
}

const reset = () => {
  timerRunning.value = false
  clearInterval(timerInterval.value)
  pauseDuration.value = 0
  timerStart.value = null
  timerStop.value = null

  time.value = {
    total: '00:00.00',
    min: '00',
    sec: '00',
    ms: '00',
  }

  laps = []
}

const discardSession = () => {
  reset()
}

const saveSession = async () => {
  try {
    const { error } = await supabase.from('sessions').insert({
      track_id: trackId.value,
      user_id: user.value?.id,
      duration: time.value.total,
    })
    if (error) throw error
    navigateTo('/sessions')
  } catch (error) {
    alert(error.message)
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <section class="flex flex-col items-center justify-center text-center h-32">
      <h1 class="text-2xl font-medium mb-1">MCO Oirschot</h1>
      <div class="flex items-center justify-center gap-x-2 text-muted-foreground text-lg">
        <Trophy class="size-5"/>
        01:34.24
      </div>
    </section>

    <section class="flex items-center justify-center h-64">
      <div class="flex items-center justify-center text-5xl font-medium text-center">
        <div class="w-16">{{ time.min }}</div>
        :
        <div class="w-16">{{ time.sec }}</div>
        .
        <div class="w-16">{{ time.ms }}</div>
      </div>
    </section>

    <section>
      <ol class="flex flex-col">
        <li v-for="lap in laps" :key="lap.time">{{ lap.time }}</li>
      </ol>
    </section>

    <section class="mt-auto">
      <div class="grid grid-cols-2 gap-x-6">
        <Button v-if="!timerStart" size="xl" class="col-span-full" @click="start">Start</Button>
        <template v-else-if="timerRunning">
          <Button variant="secondary" size="xl" @click="setLap">Ronde</Button>
          <Button variant="destructive" size="xl" @click="stop">Stop</Button>
        </template>
        <template v-else-if="timerStop">
          <Button size="lg" @click="saveSession">Opslaan</Button>
<!--          <Dialog>-->
<!--            <DialogTrigger as-child>-->
<!--              <Button variant="secondary" size="xl">Afronden</Button>-->
<!--            </DialogTrigger>-->
<!--            <DialogTitle>Jouw sessie in MCO Oirschot</DialogTitle>-->
<!--            <DialogContent>-->
<!--              <div>-->
<!--                Totale duur-->
<!--                <div class="text-2xl font-medium">15:34.24</div>-->
<!--              </div>-->
<!--              <div>-->
<!--                Beste rondetijd-->
<!--                <div class="text-2xl font-medium">01:45.21</div>-->
<!--              </div>-->
<!--            </DialogContent>-->
<!--            <DialogFooter>-->
<!--              <Button variant="secondary" size="lg" @click="discardSession">Verwijderen</Button>-->
<!--              <Button size="lg" @click="saveSession">Opslaan</Button>-->
<!--            </DialogFooter>-->
<!--          </Dialog>-->
          <Button size="xl" @click="start">Hervatten</Button>
        </template>
      </div>
    </section>
  </div>

</template>

<style scoped>

</style>