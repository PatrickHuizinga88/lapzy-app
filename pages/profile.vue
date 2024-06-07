<script setup lang="ts">
import type {Database} from "~/types/supabase";
import {PlusCircle, Loader2} from "lucide-vue-next";

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()

const { data: profile, pending } = await useAsyncData('profile', async () => {
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

const form = reactive({
  first_name: profile.value?.first_name || '',
  last_name: profile.value?.last_name || '',
  rider_number: profile.value?.rider_number || '',
  theme:  profile.value?.theme || '220 76% 49%',
  favoriteTracks: profile.value?.favorite_tracks || [],
})

const themes = [
  {
    name: 'Blauw',
    value: '220 76% 49%'
  },
  {
    name: 'Oranje',
    value: '22 100% 50%'
  },
  {
    name: 'Groen',
    value: '94 65% 45%'
  },
]

const tracks = [
  {
    label: "MCO Oirschot",
    value: "1"
  },
  {
    label: "MAC Budel",
    value: "2"
  },
]

const themeBackground = (theme: string) => {
  return {
    'bg-blue-600': theme === '220 76% 49%',
    'bg-orange-500': theme === '22 100% 50%',
    'bg-lime-500': theme === '94 65% 45%',
  }
}

const onSubmit = async () => {
  if (!user.value) return

  try {
    const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.value.id,
          first_name: form.first_name,
          last_name: form.last_name,
          rider_number: parseInt(form.rider_number),
          theme: form.theme,
        })
    if (error) throw error
    location.reload()
  } catch (error) {
    console.error(error)
    alert('Profiel opslaan mislukt, probeer het later opnieuw')
  }
}
</script>

<template>
  <h1 class="text-2xl font-bold mb-8">Mijn profiel</h1>
  <form @submit.prevent="onSubmit" class="space-y-8">
    <section id="profile-settings" class="space-y-6">
      <div class="grid grid-cols-2 gap-6">
        <div>
          <Label for="first_name">Voornaam</Label>
          <Input
              v-model="form.first_name"
              id="first_name"
              name="first_name"
              type="text"
          />
        </div>
        <div>
          <Label for="last_name">Achternaam</Label>
          <Input
              v-model="form.last_name"
              id="last_name"
              name="last_name"
              type="text"
          />
        </div>
      </div>
      <div>
        <Label for="rider_number">Rijdersnummer</Label>
        <Input
            v-model="form.rider_number"
            id="rider_number"
            name="rider_number"
            type="number"
            class="w-24"
            min="1"
            max="9999"
        />
      </div>
    </section>

    <section id="app-settings" class="space-y-6">
      <h2 class="text-lg font-semibold">App instellingen</h2>
      <div>
        <Label class="block">Favoriete crossbanen</Label>

        <MultiSelect :options="tracks" placeholder="Selecteer een crossbaan..."/>
<!--        <div class="flex gap-4">-->
<!--          <div v-for="track in form.favoriteTracks">{{ track.name }}</div>-->
<!--        </div>-->
<!--        <DropdownMenu>-->
<!--          <DropdownMenuTrigger as-child>-->
<!--            <Button variant="outline" size="sm">-->
<!--              Crossbaan toevoegen-->
<!--              <PlusCircle class="ml-2 size-4"/>-->
<!--            </Button>-->
<!--          </DropdownMenuTrigger>-->
<!--          <DropdownMenuContent>-->
<!--            <DropdownMenuItem>-->
<!--              test-->
<!--            </DropdownMenuItem>-->
<!--          </DropdownMenuContent>-->
<!--        </DropdownMenu>-->
      </div>
      <div>
        <Label>Thema</Label>
        <div class="flex gap-x-3">
          <div v-for="theme in themes">
            <input type="radio" :id="theme.value" name="condition" v-model="form.theme" :value="theme.value"
                   class="hidden peer"/>
            <Label
                :for="theme.value"
                :class="cn('inline-flex items-center justify-center size-8 border border-input rounded-full cursor-pointer peer-checked:outline-none peer-checked:ring-2 peer-checked:ring-ring peer-checked:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', themeBackground(theme.value))"
            ></Label>
          </div>
        </div>
      </div>
    </section>

    <Button type="submit" class="w-full" :disabled="pending">
      Opslaan
      <Loader2 v-if="pending" class="size-5 ml-2 animate-spin"/>
    </Button>
  </form>
</template>

<style scoped>

</style>