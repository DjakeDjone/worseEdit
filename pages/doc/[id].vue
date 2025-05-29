<script setup lang="ts">
import { fakeUser, toYUser } from "@/server/model/user";

const { user } = useUserHandler();

const content = ref("<h1>Worse</h1><p>The better Editor! 🎉</p>");
const route = useRoute();
const fileName = computed(() => {
    return route.params.id ? `${route.params.id}` : "public";
});

</script>

<template>
    <main class="mx-auto p-4">
        <div class="mb-4">
            <NuxtLink to="/">
                <h1 class="text-2xl font-bold mb-4">WOrse Editor</h1>
            </NuxtLink>
            <h2 class="text-xl">Welcome {{ user ? user.name : 'Developer' }}!</h2>
        </div>

        
        <div class="rounded-lg md:p-4 bg-white shadow-sm">
            <ClientOnly>
                <WorseEditor v-model="content" :fileName="fileName" :user="toYUser(user?user:fakeUser)" />
            </ClientOnly>
        </div>
    </main>
</template>