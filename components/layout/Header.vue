<script setup lang="ts">
import {LogOut, User} from "lucide-vue-next";
import type {Database} from "~/types/supabase";

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()

const {data: profile} = await useAsyncData('profile', async () => {
  if (!user.value) return
  try {
    const {data, error} = await supabase
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

const logOut = async () => {
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>

<template>
  <ClientOnly>
    <ThemeProvider :theme="profile?.theme"/>
  </ClientOnly>

  <header
    class="sticky top-0 left-0 flex justify-between items-center h-[var(--header-height)] bg-background border-b border-border">
    <div class="container">
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center">
          <ClientOnly>
            <Logo/>
            <template #fallback class="h-6 w-6 mr-1 bg-primary rounded-full">
              <img src="@/assets/images/logo.svg" alt="Logo" class="h-6 mr-1"/>
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
              <img src="@/assets/images/helmet.svg" alt="Gebruiker" class="size-5"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent :align-offset="10">
            <DropdownMenuItem as-child>
              <NuxtLink to="/profile">
                <User class="mr-2 size-4"/>
                Mijn profiel
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuItem @click="logOut">
              <LogOut class="mr-2 size-4"/>
              Uitloggen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>

<style>
:root {
  --header-height: 64px;
}
</style>