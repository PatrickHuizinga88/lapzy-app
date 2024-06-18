<script setup lang="ts">
import StatCard from "~/components/StatCard.vue";
import type { Database } from "~/types/supabase";
import { Play } from 'lucide-vue-next'
import dayjs from "dayjs";

useSeoMeta({
  title: 'Dashboard - Lapzy',
  description: 'Overzicht van jouw laatste activiteit.'
})

const user = useSupabaseUser()
const supabase = useSupabaseClient<Database>()

const {data: recentSessions, pending: pendingSessions} = await useLazyAsyncData('recentSessions', async () => {
  if (!user.value) {
    navigateTo('/login')
    return
  }

  const {data} = await supabase.from('sessions')
      .select('id,track_id,duration,note,created_at')
      .eq('user_id', user.value.id)
      .order('created_at', {ascending: false})
      .limit(3)

  if (!data) return []

  return await Promise.all(data.map(async session => {
    const { data: track, error } = await supabase.from('tracks')
        .select('name,location')
        .eq('id', session.track_id)
        .single()
    if (error) throw error
    return {...session, track_name: track.name, track_location: track.location}
  }))
})

const {data: profile} = await useLazyAsyncData('profile', async () => {
  if (!user.value) {
    navigateTo('/login')
    return
  }

  const {data, error} = await supabase.from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()
  if (error) throw error
  return data
})

const {data: statistics, pending: statisticsPending } = await useLazyAsyncData('statistics', async () => {
  const {count: sessionsAmount, error: errorSessions} = await supabase.from('sessions')
      .select('*', {head:true, count: 'exact'})
      .eq('user_id', user.value.id)
      .gte('created_at', dayjs().subtract(1, 'month'))
  if (errorSessions) throw errorSessions

  const {data: tracksVisited, error: errorTracks} = await supabase.from('sessions')
      .select('track_id', {count: 'exact'})
      .eq('user_id', user.value.id)
      .gte('created_at', dayjs().subtract(1, 'month'))
  if (errorTracks) throw errorTracks

  const uniqueTracksVisited = tracksVisited.map(track => track.track_id)
      .filter((value, index, self) => self.indexOf(value) === index)

  return {
    sessionsAmount,
    tracksVisited: uniqueTracksVisited.length
  }
})
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl sm:text-3xl font-semibold">
      Welkom terug<template v-if="profile?.first_name">, {{profile.first_name}}</template>!
    </h1>

    <section>
      <h2 class="font-semibold mb-3">Jouw afgelopen maand</h2>
      <div class="overflow-x-auto">
        <div class="flex gap-x-2 *:shrink-0">
<!--          <StatCard title="Uren gereden" value="5,3" />-->
          <StatCard title="Sessies" :value="statistics?.sessionsAmount" :loading="statisticsPending" />
          <StatCard title="Banen bezocht" :value="statistics?.tracksVisited" :loading="statisticsPending" />
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
      <div class="space-y-2">
        <template v-if="recentSessions && recentSessions.length">
          <SessionCard v-for="session in recentSessions" :session="session" :trackName="session.track_name" :trackLocation="session.track_location" />
        </template>
        <template v-else-if="pendingSessions">
          <Skeleton v-for="i in 3" class="h-[4.875rem] w-full"/>
        </template>
        <p v-else class="text-muted-foreground text-sm">Geen sessies gevonden.</p>
      </div>
    </section>

    <SessionDialog>
      <Button size="xl" class="w-full">
        Start nieuwe sessie
        <Play class="size-5 ml-2.5"/>
      </Button>
    </SessionDialog>
  </div>
</template>

<style scoped>

</style>