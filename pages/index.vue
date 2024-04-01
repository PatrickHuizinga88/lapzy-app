<script setup lang="ts">
import StatCard from "~/components/StatCard.vue";
import { Play } from 'lucide-vue-next'

const user = useSupabaseUser()
const supabase = useSupabaseClient()

const {data: recentSessions, pending: pendingSessions} = useAsyncData('sessions', async () => {
  if (!user.value) {
    navigateTo('/login')
    return
  }

  const {data} = await supabase.from('sessions')
      .select('id,track_id,duration,created_at')
      .eq('user_id', user.value.id)
      .order('created_at', {ascending: false})
      .limit(3)
  return data
})
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl sm:text-3xl font-semibold">Welkom terug, Patrick!</h1>

<!--    <section>-->
<!--      <h2 class="font-semibold mb-2">Statistieken</h2>-->
<!--      <div class="overflow-x-auto">-->
<!--        <div class="flex gap-x-2 *:shrink-0">-->
<!--          <StatCard title="Uren gereden" value="5,3"/>-->
<!--          <StatCard title="Sessies" value="17"/>-->
<!--          <StatCard title="Banen bezocht" value="3"/>-->
<!--        </div>-->
<!--      </div>-->
<!--    </section>-->

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
        <SessionCard v-if="recentSessions?.length" v-for="session in recentSessions" :key="session.id" :session="session"/>
        <template v-else-if="pendingSessions">
          <Skeleton v-for="i in 3" class="h-16 w-full"/>
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