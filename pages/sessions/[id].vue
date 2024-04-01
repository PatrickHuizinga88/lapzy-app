<script setup lang="ts">
const { id } = useRoute().params
const supabase = useSupabaseClient()

const {data: session, pending} = useAsyncData('session', async () => {
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
  <h1>Je sessie in {{ session?.track_id }}</h1>
</template>

<style scoped>

</style>