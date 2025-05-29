<script setup lang="ts">
import { fakeUser, toYUser } from "@/server/model/user";

const { user } = useUserHandler();

const content = ref("<h1>Worse</h1><p>The better Editor! 🎉</p>");
const fileName = ref("worse");

</script>

<template>
    <main class="container mx-auto p-4">
        <div class="mb-4">
            <h1 class="text-2xl font-bold mb-4">WOrse Editor</h1>
            <h2 class="text-xl">Welcome {{ user ? user.name : 'Developer' }}!</h2>
        </div>

        <section>
            <Explorer />
        </section>
    </main>
</template>