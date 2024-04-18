<script setup lang="ts">
import type {Lap} from "~/types";

defineProps<{
  track?: string
}>()

const timeElapsed = ref(0)
const totalTimeElapsed = ref(0)
const interval = ref<number | undefined>(undefined)
const timerRunning = ref(false)

const laps = ref<Lap[]>([])

const emit = defineEmits(['save'])

const start = () => {
  timerRunning.value = true
  interval.value = setInterval(() => {
    timeElapsed.value += 10
    totalTimeElapsed.value += 10
  }, 10)
}

const setLap = () => {
  laps.value.push({
    time: `${formattedTime(timeElapsed.value).min}:${formattedTime(timeElapsed.value).sec}.${formattedTime(timeElapsed.value).ms}`,
    duration: `${formattedTime(totalTimeElapsed.value).min}:${formattedTime(totalTimeElapsed.value).sec}.${formattedTime(totalTimeElapsed.value).ms}`
  })
  timeElapsed.value = 0
}

const pause = () => {
  timerRunning.value = false
  clearInterval(interval.value)
}

const reset = () => {
  timerRunning.value = false
  clearInterval(interval.value)
  interval.value = 0
  timeElapsed.value = 0
  totalTimeElapsed.value = 0
}

const formattedTime = (time: number) => {
  const min = Math.floor(time / 60000)
  const sec = Math.floor((time % 60000) / 1000)
  const ms = Math.floor((time % 1000) / 10)

  return {
    min: zeroPrefix(min, 2),
    sec: zeroPrefix(sec, 2),
    ms: zeroPrefix(ms, 2),
  }
}

const zeroPrefix = (num: number, digit: number) => {
  return (Array(digit).join('0') + num).slice(-digit)
}

const isBestLap = (lapTime: string) => {
  if (!laps.value.length) return false
  const bestLap = laps.value.reduce((prev, current) => (prev.time < current.time) ? prev : current)
  return bestLap.time === lapTime
}

const bestLapTime = computed(() => {
  if (!laps.value.length) return '00:00.00'
  const bestLap = laps.value.reduce((prev, current) => (prev.time < current.time) ? prev : current)
  return bestLap.time
})

const sessionDuration = computed(() => {
  let lastLap = laps.value.slice(-1)[0]
  return lastLap.duration
})

const discardSession = () => {
  laps.value = []
  timeElapsed.value = 0
  totalTimeElapsed.value = 0
}

onUnmounted(() => {
  clearInterval(interval.value)
})
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center justify-center text-5xl font-medium text-center">
      <div class="w-16 tabular-nums">{{ formattedTime(timeElapsed).min }}</div>
      :
      <div class="w-16 tabular-nums">{{ formattedTime(timeElapsed).sec }}</div>
      .
      <div class="w-16 tabular-nums">{{ formattedTime(timeElapsed).ms }}</div>
    </div>

    <div class="mt-auto">
      <section v-if="laps.length" class="mt-auto mb-8">
        <div class="overflow-y-auto h-48 -mr-2">
          <ol class="flex flex-col-reverse justify-end gap-y-2">
            <li v-for="(lap, index) in laps" :key="index" class="grid grid-cols-3 items-center text-sm pr-2">
              <span class="inline-flex items-center justify-center bg-muted font-medium rounded text-muted-foreground size-6">{{ index + 1 }}</span>
              <span :class="{'text-indigo-500 font-medium': isBestLap(lap.time)}">{{ lap.time }}</span>
              <span class="text-right text-muted-foreground">{{ lap.duration }}</span>
            </li>
          </ol>
        </div>
      </section>

      <section>
        <div class="grid grid-cols-2 gap-x-6">
          <Button v-if="!timerRunning && !totalTimeElapsed" size="xl" class="col-span-full" @click="start">Start</Button>
          <template v-else-if="timerRunning">
            <Button variant="secondary" size="xl" @click="setLap">Ronde</Button>
            <Button variant="destructive" size="xl" @click="pause">Stop</Button>
          </template>
          <template v-else-if="!timerRunning && totalTimeElapsed">
            <Dialog>
              <DialogTrigger as-child>
                <Button variant="secondary" size="xl">Afronden</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Jouw sessie in {{ track }}</DialogTitle>
                <div>
                  Totale duur
                  <div class="text-2xl font-medium">{{ sessionDuration }}</div>
                </div>
                <div>
                  Beste rondetijd
                  <div class="text-2xl font-medium">{{ bestLapTime }}</div>
                </div>
                <DialogFooter class="gap-y-2">
                  <Button variant="secondary" @click="discardSession">Verwijderen</Button>
                  <Button @click="emit('save', laps, sessionDuration)">Opslaan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button size="xl" @click="start">Hervatten</Button>
          </template>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>

</style>