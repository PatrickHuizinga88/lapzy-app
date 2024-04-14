<script setup lang="ts">
import {User, Home, Timer, Calendar, LogOut} from 'lucide-vue-next'
import type {Database} from "~/types/supabase";

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()

const open = ref(false)
const newLocation = ref('')

const { data: profile } = await useAsyncData('profile', async () => {
  if (!user.value) {
    navigateTo('/login')
    return
  }

  try {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()
    if (error) throw error

    return data
  } catch (error) {
    console.error(error)
  }
})

const initials = computed(() => {
  if (!profile.value || !profile.value.first_name || !profile.value.last_name) return
  return profile.value.first_name.charAt(0) + profile.value.last_name.charAt(0)
})

const currentPath = computed(() => {
  return useRoute().path
})

const logOut = async () => {
  await supabase.auth.signOut()
  navigateTo('/login')
}

const componentToShow = computed(() => {
  if (currentPath.value === '/timer') {
    return 'button';
  }

  return resolveComponent('NuxtLink');
});

const confirmNavigation = (path: string) => {
  if (currentPath.value !== '/timer') navigateTo(path)

  open.value = true
  newLocation.value = path
}

const leave = () => {
  navigateTo(newLocation.value)
  open.value = false
  newLocation.value = ''
}
</script>

<template>
  <NuxtLoadingIndicator :color="`hsl(${profile?.theme})`" />
  <ClientOnly>
    <ThemeProvider :theme="profile?.theme" />
  </ClientOnly>
  <header class="sticky top-0 left-0 h-[72px] bg-background border-b border-border py-4">
    <div class="container">
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center">
          <ClientOnly>
            <Logo />
            <template #fallback class="h-6 w-6 mr-1 bg-primary rounded-full">
              <img src="../assets/images/logo.svg" alt="Logo" class="h-6 mr-1"/>
            </template>
          </ClientOnly>
          <div class="font-bold font-logo text-2xl italic">
            <template v-if="initials && profile?.rider_number">
              {{ initials }}<span class="text-muted-foreground">{{ profile?.rider_number }}</span>
            </template>
            <template v-else>LAP<span class="text-muted-foreground">ZY</span></template>
          </div>
        </NuxtLink>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon" class="-mr-2.5">
              <User class="size-5"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent :align-offset="10">
            <DropdownMenuItem as-child>
              <NuxtLink to="/profile">
                <User class="mr-2 size-4" />
                Mijn profiel
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuItem @click="logOut">
              <LogOut class="mr-2 size-4" />
              Uitloggen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
  <main class="h-[calc(100svh-72px)] overflow-auto">
    <div class="h-full pt-8 pb-24">
      <div class="h-full container">
        <slot/>
      </div>
    </div>
    <div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border">
      <div class="grid grid-cols-3 h-full max-w-lg mx-auto font-medium text-xs">
        <component :is="componentToShow"
                   @click="currentPath === '/timer' ? confirmNavigation('/') : null"
                   :to="currentPath === '/timer' ? null : '/'"
                   class="inline-flex flex-col items-center justify-center gap-y-1 px-5 opacity-50"
                   activeClass="!opacity-100 font-semibold"
        >
          <Home class="size-5"/>
          Home
        </component>
        <SessionDialog>
          <button :class="[{'!opacity-100 font-semibold' : currentPath === '/timer'}, 'inline-flex flex-col items-center justify-center gap-y-1 px-5 opacity-50']" :disabled="currentPath === '/timer'">
            <Timer class="size-5"/>
            Stopwatch
          </button>
        </SessionDialog>
        <component :is="componentToShow"
                   @click="currentPath === '/timer' ? confirmNavigation('/sessions') : null"
            :to="currentPath === '/timer' ? null : '/sessions'"
            class="inline-flex flex-col items-center justify-center gap-y-1 px-5 opacity-50"
            activeClass="!opacity-100 font-semibold"
        >
          <Calendar class="size-5"/>
          Sessies
        </component>
      </div>
    </div>
  </main>

  <Dialog v-bind:open="open">
    <DialogContent>
      <DialogTitle>Pagina verlaten?</DialogTitle>
      <DialogDescription>Je huidige sessie zal niet worden opgeslagen.</DialogDescription>
      <DialogFooter class="flex-row gap-x-4">
        <Button @click="open = false" variant="secondary" class="w-full">Annuleren</Button>
        <Button @click="leave" variant="destructive" class="w-full">Verlaten</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>