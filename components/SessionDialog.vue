<script setup lang="ts">
import {Star} from "lucide-vue-next";

const featuredTracks = [
  {
    id: 1,
    name: "MCO Oirschot",
  },
  {
    id: 2,
    name: "MAC Budel",
  },
  {
    id: 3,
    name: "SRMV Berghem",
  },
  {
    id: 4,
    name: "De Landsard",
  },
]

const conditions = [
  {
    value: "GOOD",
    name: "Perfect",
  },
  {
    value: "MEDIUM",
    name: "Ingereden",
  },
  {
    value: "HEAVY",
    name: "Zwaar",
  },
]

const selectedTrack = ref<number | undefined>(undefined)
const selectedCondition = ref('MEDIUM')
const error = ref('')
const open = ref(false)

const handleSubmit = () => {
  if (selectedTrack.value === undefined) {
    error.value = 'Selecteer een baan'
    return
  }

  navigateTo({
    path: '/timer',
    query: {
      track_id: selectedTrack.value,
      condition: selectedCondition.value,
    }
  })

  open.value = false
  selectedTrack.value = undefined
  selectedCondition.value = 'MEDIUM'
  error.value = ''
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent aria-describedby="Stel de baan en status van de sessie in.">
      <DialogTitle>
        <h3 class="text-lg font-semibold">Sessie instellen</h3>
      </DialogTitle>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-y-2">
          <div v-for="track in featuredTracks">
            <input type="radio" :id="track.id.toString()" name="selected-track" v-model="selectedTrack" :value="track.id" class="hidden peer" />
            <label
                :for="track.id.toString()"
                class="inline-flex items-center justify-between w-full px-4 py-4 bg-background border border-input rounded-lg cursor-pointer peer-checked:border-primary peer-checked:text-primary peer-checked:bg-primary/10 hover:bg-muted"
            >
              {{ track.name }}
              <Star class="size-5 text-yellow-400"/>
            </label>
          </div>
        </div>

        <div>
          <label class="inline-block mb-3">Hoe ligt de baan?</label>
          <div class="grid grid-cols-3 gap-x-3">
            <div v-for="condition in conditions">
              <input type="radio" :id="condition.value" name="condition" v-model="selectedCondition" :value="condition.value" class="hidden peer" />
              <Label
                  :for="condition.value"
                  class="inline-flex items-center justify-center w-full px-4 py-3 bg-background border border-input rounded-lg cursor-pointer peer-checked:border-primary peer-checked:text-primary peer-checked:bg-primary/10 hover:bg-muted"
              >
                {{ condition.name }}
              </Label>
            </div>
          </div>
        </div>

        <p v-if="error" class="text-red-500 text-sm">{{ error }}</p>

        <Button type="submit" size="lg" class="w-full">Start sessie</Button>
      </form>
    </DialogContent>
  </Dialog>
</template>

<style scoped>

</style>