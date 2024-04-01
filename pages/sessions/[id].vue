<script setup lang="ts">
const { id } = useRoute().params
const supabase = useSupabaseClient()

const {data: session, pending: pendingSession} = await useAsyncData('session', async () => {
  const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', id)
      .single()
  if (error) throw error
  return data
})
</script>

<template>
  <h1 class="text-center text-lg">Je sessie in <span class="block text-3xl font-semibold mt-2">{{ session?.track_id }}</span></h1>
</template>

<style scoped>

</style>