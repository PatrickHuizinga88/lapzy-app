<script setup lang="ts">
import {Skeleton} from "~/components/ui/skeleton";
import type {Database} from "~/types/supabase";

useSeoMeta({
  title: 'Sessies - Lapzy',
  description: 'Inzicht in al je sessies.'
})

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const notificationStore = useNotificationStore()

const {data: sessions, status} = useLazyAsyncData('sessions', async () => {
  if (!user.value) return []

  try {
    const {data, error} = await supabase.from('sessions')
        .select('id,track_id,duration,note,created_at')
        .eq('user_id', user.value.id)
        .order('created_at', {ascending: false})

    if (error) {
      throw error
    }
    return await Promise.all(data.map(async session => {
      const { data: track, error } = await supabase.from('tracks')
          .select('name,location')
          .eq('id', session.track_id)
          .single()
      if (error) throw error
      return {...session, track_name: track.name, track_location: track.location}
    }))
  } catch (error) {
    notificationStore.createNotification({
      type: 'destructive',
      action: 'retrieve',
      item: 'sessies'
    })
    console.error(error)
  }
})
</script>

<template>
  <h1 class="text-2xl sm:text-3xl font-semibold mb-6">Jouw sessies</h1>
  <div class="space-y-2">
    <SessionCard v-if="sessions && sessions?.length" v-for="session in sessions" :key="session.id" :session="session" :trackName="session.track_name" :trackLocation="session.track_location"/>
    <template v-else-if="status === 'pending'">
      <Skeleton v-for="i in 4" class="h-[4.875rem] w-full"/>
    </template>
    <p v-else class="text-muted-foreground text-sm">Geen sessies gevonden.</p>
  </div>
</template>

<style scoped>

</style>