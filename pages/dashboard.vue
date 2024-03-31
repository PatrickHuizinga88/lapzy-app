<script setup lang="ts">
import StatCard from "~/components/ui/StatCard.vue";
import { Play, Star } from 'lucide-vue-next'

const recentSessions = [
  {
    id: 1,
    track: "MCO Oirschot",
    date: "30-03-2024",
    time: "01:37.56",
  },
  {
    id: 2,
    track: "MCO Oirschot",
    date: "30-03-2024",
    time: "01:37.56",
  },
  {
    id: 3,
    track: "MCO Oirschot",
    date: "30-03-2024",
    time: "01:37.56",
  },
]

const featuredTracks = [
  {
    id: 1,
    name: "MCO Oirschot",
  },
  {
    id: 2,
    name: "MAC Budel",
  },
  {
    id: 3,
    name: "De Landsard",
  },
]

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
    value: "BAD",
    name: "Zwaar",
  },
]

const selectedTrack = ref<number | undefined>(undefined)
const selectedCondition = ref<string | undefined>('MEDIUM')

const handleSubmit = () => {
  if (selectedTrack.value === undefined || selectedCondition.value === undefined) {
    return
  }

  navigateTo({
    path: '/timer',
    query: {
      track: selectedTrack.value,
      condition: selectedCondition.value,
    }
  })
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl sm:text-3xl font-semibold">Welkom terug, Patrick!</h1>

    <section>
      <h2 class="font-semibold mb-2">Statistieken</h2>
      <div class="overflow-x-auto">
        <div class="flex gap-x-2 *:shrink-0">
          <StatCard title="Uren gereden" value="5,3" />
          <StatCard title="Sessies gereden" value="21" />
          <StatCard title="Banen bezocht" value="3" />
        </div>
      </div>
    </section>

    <section>
      <div class="flex items-center justify-between mb-2">
        <h2 class="font-semibold">Recente sessies</h2>
        <Button variant="ghost" size="sm" class="-mr-3" as-child>
          <NuxtLink to="/sessions">
            Alles bekijken
          </NuxtLink>
        </Button>
      </div>
      <div class="flex flex-col gap-y-2">
        <NuxtLink :to="`/session/${session.id}`" v-for="session in recentSessions" class="flex items-center justify-between bg-muted rounded-lg p-4 hover:bg-muted/80">
          <div>
            <div class="font-medium">{{ session.track }}</div>
            <div class="text-sm text-muted-foreground">{{ session.date }}</div>
          </div>
          <div class="text-lg font-medium">{{ session.time }}</div>
        </NuxtLink>
      </div>
    </section>

    <Dialog>
      <DialogTrigger as-child>
        <Button size="xl" class="w-full">
          Start nieuwe sessie
          <Play class="size-5 ml-2.5"/>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          <h3 class="text-lg font-semibold">Sessie instellen</h3>
        </DialogTitle>

        <form class="space-y-6" @submit.prevent="handleSubmit">
          <div class="flex flex-col gap-y-2">
            <div v-for="track in featuredTracks">
              <input type="radio" :id="track.id.toString()" name="selected-track" v-model="selectedTrack" :value="track.id" class="hidden peer" />
              <Label
                  :for="track.id.toString()"
                  class="inline-flex items-center justify-between w-full p-4 bg-background border border-input rounded-lg cursor-pointer peer-checked:border-primary peer-checked:text-primary peer-checked:bg-primary/10 hover:bg-muted"
              >
                {{ track.name }}
                <Star class="size-5 text-yellow-400"/>
              </Label>
            </div>
          </div>

          <div>
            <Label class="inline-block mb-3">Hoe ligt de baan?</Label>
            <div class="grid grid-cols-3 gap-x-3">
              <div v-for="condition in conditions">
                <input type="radio" :id="condition.value" name="condition" v-model="selectedCondition" :value="condition.value" class="hidden peer" />
                <Label
                    for="condition"
                    class="inline-flex items-center justify-center w-full p-4 bg-background border border-input rounded-lg cursor-pointer peer-checked:border-primary peer-checked:text-primary peer-checked:bg-primary/10 hover:bg-muted"
                >
                  {{ condition.name }}
                </Label>
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" class="w-full">Start sessie</Button>
        </form>
      </DialogContent>
    </Dialog>

  </div>


</template>

<style scoped>

</style>