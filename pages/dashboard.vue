<script setup lang="ts">
import StatCard from "~/components/ui/StatCard.vue";
import { Play } from 'lucide-vue-next'

const recentSessions = [
  {
    track: "MCO Oirschot",
    date: "30-03-2024",
    time: "01:37.56",
  },
  {
    track: "MCO Oirschot",
    date: "30-03-2024",
    time: "01:37.56",
  },
  {
    track: "MCO Oirschot",
    date: "30-03-2024",
    time: "01:37.56",
  },
]
</script>

<template>
  <div class="space-y-10">
    <h1 class="text-3xl font-semibold">Welkom terug, Patrick!</h1>

    <section>
      <h2 class="text-lg font-semibold mb-4">Statistieken</h2>
      <div class="overflow-x-auto">
        <div class="flex gap-x-2 *:shrink-0">
          <StatCard title="Uren gereden" value="5,3" />
          <StatCard title="Banen bezocht" value="3" />
          <StatCard title="Banen bezocht" value="3" />
          <StatCard title="Banen bezocht" value="3" />
        </div>
      </div>
    </section>

    <section>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Recente sessies</h2>
        <Button variant="ghost" size="sm" class="-mr-3">Alles bekijken</Button>
      </div>
      <div class="flex flex-col gap-y-2">
        <NuxtLink to="#" v-for="session in recentSessions" class="flex items-center justify-between bg-muted rounded-xl p-4 hover:bg-muted/80">
          <div>
            <div class="font-semibold mb-1">{{ session.track }}</div>
            <div class="text-sm text-muted-foreground font-medium">{{ session.date }}</div>
          </div>
          <div class="text-xl font-semibold">{{ session.time }}</div>
        </NuxtLink>
      </div>
    </section>

    <Button size="xl" class="w-full">
      Start nieuwe sessie
      <Play class="size-5 ml-2.5"/>
    </Button>
  </div>


</template>

<style scoped>

</style>