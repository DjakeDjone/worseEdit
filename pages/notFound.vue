<script setup lang="ts">
import { NuxtLink } from '#components';


</script>

<template>
    <UiPage center class="flex-col">
        <h1 class="text-center text-4xl mb-4">404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <NuxtLink to="/" class="text-blue-500 hover:underline">Go back to home</NuxtLink>
    </UiPage>
</template>