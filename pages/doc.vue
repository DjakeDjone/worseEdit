<script setup lang="ts">
import { fakeUser, toYUser } from "@/server/model/user";

const { user } = useUserHandler();

const content = ref("<h1>Worse</h1><p>The better Editor! 🎉</p>");
const fileName = ref("public");

</script>

<template>
    <main class="container mx-auto p-4">
        <div class="mb-4">
            <h1 class="text-2xl font-bold mb-4">WOrse Editor</h1>
            <h2 class="text-xl">Welcome {{ user ? user.name : 'Developer' }}!</h2>
        </div>

        <InputText
            v-model="fileName"
            label="File Name"
            placeholder="Enter file name"
            class="mb-4"
            :disabled="!user"
        />
        <div class="border rounded-lg p-4 bg-white shadow-sm">
            <ClientOnly>
                <WorseEditor v-model="content" :fileName="fileName" :user="toYUser(user?user:fakeUser)" />
            </ClientOnly>
        </div>
    </main>
</template>