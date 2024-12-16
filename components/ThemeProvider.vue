<script setup lang="ts">
const props = defineProps<{
  theme?: string
}>()

const theme = ref(localStorage.getItem('theme') || null)

const applyTheme = () => {
  if (props.theme) {
    theme.value = props.theme
    localStorage.setItem('theme', props.theme)
  }

  if (!theme.value) return

  document.documentElement.style.setProperty('--primary', theme.value)
  document.documentElement.style.setProperty('--ring', theme.value)
}

onMounted(() => {
  applyTheme()
})
</script>

<template>

</template>