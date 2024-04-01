<script setup lang="ts">
import {Skeleton} from "~/components/ui/skeleton";

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const {data: sessions, pending: pending} = useAsyncData('sessions', async () => {
  if (!user.value) {
    navigateTo('/login')
    return
  }
  const {data, error} = await supabase.from('sessions')
      .select('id,track_id,duration,created_at')
      .order('created_at', {ascending: false})
      .eq('user_id', user.value.id)
  if (error) throw error
  return data
})
</script>

<template>
  <h1 class="text-2xl sm:text-3xl font-semibold mb-6">Jouw sessies</h1>
  <div class="space-y-2">
    <SessionCard v-if="!pending && sessions?.length" v-for="session in sessions" :key="session.id" :session="session"/>
    <template v-else-if="pending">
      <Skeleton v-for="i in 4" class="h-16 w-full"/>
    </template>
    <p v-else class="text-muted-foreground text-sm">Geen sessies gevonden.</p>
  </div>
</template>

<style scoped>

</style>