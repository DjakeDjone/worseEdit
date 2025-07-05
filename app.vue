<template>
  <div class="h-full">
    <NuxtLoadingIndicator />
    <NuxtPage></NuxtPage>
  </div>
</template>

<script setup lang="ts">

onMounted(() => {
  // set .dark on root if dark mode is enabled
  if (useColorMode().value === 'dark') {
    document.documentElement.classList.add('dark');
    console.warn('Dark mode is enabled');
  } else {
    document.documentElement.classList.remove('dark');
  }
});

</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>