<script setup lang="ts">
import applyTheme from "~/utils/applyTheme";

const props = defineProps<{
  theme?: string
}>()

const theme = ref(localStorage.getItem('theme') || props.theme || undefined)

onMounted(() => {
  applyTheme(theme.value || props.theme)
})
</script>

<template>

</template>