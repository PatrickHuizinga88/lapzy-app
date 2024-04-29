<script setup lang="ts">
import {Skeleton} from "~/components/ui/skeleton";

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const {data: sessions, pending: pending} = useAsyncData('sessions', async () => {
  if (!user.value) {
    navigateTo('/login')
    return
  }
  const {data} = await supabase.from('sessions')
      .select('id,track_id,duration,created_at')
      .eq('user_id', user.value.id)
      .order('created_at', {ascending: false})

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
</script>

<template>
  <h1 class="text-2xl sm:text-3xl font-semibold mb-6">Jouw sessies</h1>
  <div class="space-y-2">
    <SessionCard v-if="!pending && sessions?.length" v-for="session in sessions" :key="session.id" :session="session" :trackName="session.track_name" :trackLocation="session.track_location"/>
    <template v-else-if="pending">
      <Skeleton v-for="i in 4" class="h-16 w-full"/>
    </template>
    <p v-else class="text-muted-foreground text-sm">Geen sessies gevonden.</p>
  </div>
</template>

<style scoped>

</style>