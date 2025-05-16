<script setup lang="ts">
const content = ref("<h1>Worse</h1><p>The better Editor! 🎉</p>");

</script>

<template>
    <main>
        hello WOrld
        <ClientOnly>
            <WorseEditor v-model="content" />
        </ClientOnly>
    </main>
</template>