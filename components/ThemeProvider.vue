<script setup lang="ts">
const props = defineProps<{
  theme?: string
}>()

const applyTheme = () => {
  if (!props.theme) return
  localStorage.setItem('theme', props.theme)
  document.documentElement.style.setProperty('--primary', props.theme)
  document.documentElement.style.setProperty('--ring', props.theme)
}

onMounted(() => {
  applyTheme()
})
</script>
