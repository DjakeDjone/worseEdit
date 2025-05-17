<script setup lang="ts">
const content = ref("<h1>Worse</h1><p>The better Editor! 🎉</p>");

</script>

<template>
    <main class="container mx-auto p-4">
        <h1 class="text-2xl font-bold mb-4">WOrse Editor</h1>
        
        <div class="mb-4">
            <NuxtLink to="/test" class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 inline-block">
                Try Collaborative Editor
            </NuxtLink>
        </div>
        
        <div class="border rounded-lg p-4 bg-white shadow-sm">
            <ClientOnly>
                <WorseEditor v-model="content" />
            </ClientOnly>
        </div>
    </main>
</template>