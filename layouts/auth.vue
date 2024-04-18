<template>
  <div class="min-h-screen flex flex-col justify-center sm:bg-muted py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm text-center">
      <img src="~/assets/images/logo.svg" alt="Logo" class="mx-auto h-12 w-auto">
      <h2 class="mt-10 text-3xl font-bold leading-9 tracking-tight mb-2">Welkom bij Lapzy</h2>
      <p class="text-muted-foreground">Jouw MX performance platform</p>
    </div>

    <slot/>

  </div>
</template>