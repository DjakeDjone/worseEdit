<script setup lang="ts">
import { fakeUser, toYUser } from "@/server/model/user";

const { user } = useUserHandler();

const content = ref("<h1>Worse</h1><p>The better Editor! 🎉</p>");
const fileName = ref("worse");

</script>

<template>
    <main class="mx-auto p-4">
        <div class="mb-4 prose">
            <WorseLogo>WORSE</WorseLogo>
            <p class="text-gray-600">A worse editor for your documents. It may be not the best editor,
                but it is shurly not the worst. <br>
                <NuxtLink to="about" class="text-red-500">
                    Or is it? 🤔
                </NuxtLink>
            </p>
            <h2 class="text-xl">Welcome {{ user ? user.name : 'Developer' }}!</h2>
        </div>

        <section>
            <Explorer />
        </section>
    </main>
</template>