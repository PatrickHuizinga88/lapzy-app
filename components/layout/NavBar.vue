<script setup lang="ts">
import {Calendar, Home, Timer} from "lucide-vue-next";

const open = ref(false)
const newLocation = ref('')

const currentPath = computed(() => {
  return useRoute().path
})

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
  <div class="shrink-0 w-full h-[var(--navbar-height)] bg-background border-t border-border">
    <div class="grid grid-cols-3 h-full max-w-lg mx-auto font-medium text-xs">
      <component :is="componentToShow"
                 @click="currentPath === '/timer' && confirmNavigation('/')"
                 :to="currentPath === '/timer' ? undefined : '/'"
                 class="inline-flex flex-col items-center justify-center gap-y-1 px-5 opacity-50"
                 activeClass="!opacity-100 font-semibold"
      >
        <Home class="size-5"/>
        Home
      </component>
      <SessionDialog>
        <button
          :class="[{'!opacity-100 font-semibold' : currentPath === '/timer'}, 'inline-flex flex-col items-center justify-center gap-y-1 px-5 opacity-50']"
          :disabled="currentPath === '/timer'">
          <Timer class="size-5"/>
          Stopwatch
        </button>
      </SessionDialog>
      <component :is="componentToShow"
                 @click="currentPath === '/timer' && confirmNavigation('/sessions')"
                 :to="currentPath === '/timer' ? undefined : '/sessions'"
                 class="inline-flex flex-col items-center justify-center gap-y-1 px-5 opacity-50"
                 activeClass="!opacity-100 font-semibold"
      >
        <Calendar class="size-5"/>
        Sessies
      </component>
    </div>
  </div>

  <Dialog v-bind:open="open">
    <DialogContent>
      <DialogTitle>Pagina verlaten?</DialogTitle>
      <DialogDescription>Je huidige sessie zal niet worden opgeslagen.</DialogDescription>
      <DialogFooter class="flex-row gap-x-4">
        <Button @click="open = false" variant="outline" class="w-full">Annuleren</Button>
        <Button @click="leave" variant="destructive" class="w-full">Verlaten</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style>
:root {
  --navbar-height: 64px;
}
</style>