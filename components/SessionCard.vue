<script setup lang="ts">
import type {Session, Track} from "~/types";

const props = defineProps<{
  session: Session
}>()

const supabase = useSupabaseClient()

const {data: track, pending: pending} = await useAsyncData('track', async () => {
  const { data, error } = await supabase.from('tracks')
      .select('name')
      .eq('id', props.session.track_id)
      .single()
  if (error) throw error
  return data
})

</script>

<template>
  <NuxtLink :to="`/sessions/${session.id}`" class="flex items-center justify-between bg-muted rounded-lg p-4 hover:bg-muted/80">
    <div>
      <div class="font-medium">{{ track?.name || session.track_id  }}</div>
      <div class="text-sm text-muted-foreground">{{ $dayjs(session.created_at).format('DD-MM-YYYY') }}</div>
    </div>
    <div class="text-lg font-medium">{{ session.duration }}</div>
  </NuxtLink>
</template>
