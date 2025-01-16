<script setup lang="ts">
import type {Database} from "~/types/supabase";
import {Loader2} from 'lucide-vue-next'

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()

const loading = ref(false)

const form = reactive({
  first_name: '',
  last_name: '',
  rider_number: '',
  theme: '220 76% 49%',
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
  {
    name: 'Rood',
    value: '0 100% 40%'
  },
  {
    name: 'Yellow',
    value: '40 100% 45%',
  }
]

const themeBackground = (theme: string) => {
  return {
    'bg-blue-600': theme === '220 76% 49%',
    'bg-orange-500': theme === '22 100% 50%',
    'bg-lime-500': theme === '94 65% 45%',
    'bg-red-600': theme === '0 100% 40%',
    'bg-amber-500': theme === '40 100% 45%',
  }
}

const onSubmit = async () => {
  try {
    loading.value = true
    const {error} = await supabase
        .from('profiles')
        .upsert({
          id: user.value?.id,
          first_name: form.first_name,
          last_name: form.last_name,
          rider_number: parseInt(form.rider_number),
          theme: form.theme,
        }, {
          onConflict: 'id'
        })
    if (error) throw error
    applyTheme(form.theme)
    navigateTo('/')
  } catch (error) {
    console.error(error)
    alert('Profiel opslaan mislukt, probeer het later opnieuw')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <section id="heading">
      <h1 class="text-2xl sm:text-3xl font-semibold mb-2">
        Welkom bij Lapzy!
      </h1>
      <p class="text-muted-foreground">Laten we beginnen met het aanmaken van je profiel.</p>
    </section>
    <section>
      <form @submit.prevent="onSubmit" class="space-y-8">
        <section id="profile-settings" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
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
                inputmode="numeric"
                class="w-24"
                min="1"
                max="9999"
            />
          </div>
        </section>

        <section id="app-settings" class="space-y-6">
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

        <div class="space-y-4">
          <Button type="submit" class="w-full" :disabled="loading">
            Opslaan
            <Loader2 v-if="loading" class="size-5 ml-2 animate-spin"/>
          </Button>
          <Button variant="outline" type="button" class="w-full" :disabled="loading" as-child>
            <NuxtLink to="/">
              Overslaan
            </NuxtLink>
          </Button>
        </div>
      </form>
    </section>
  </div>
</template>

<style scoped>

</style>