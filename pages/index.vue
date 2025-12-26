<script setup lang="ts">
import { fakeUser, toYUser } from "@/server/model/user";

const { user } = useUserHandler();

const content = ref("<h1>Worse</h1><p>The better Editor! 🎉</p>");
const fileName = ref("worse");

</script>

<template>
    <main class="mx-auto">
        <!-- Premium glassmorphic header -->
        <header class="sticky top-0 z-50 mb-4 px-4 py-3 
                      backdrop-blur-xl border-b">
            <div class="flex items-center justify-between">
                <WorseLogo>WORSE</WorseLogo>
                <WorseHeaderUserMenu />
            </div>
        </header>

        <div class="px-4">
            <div class="mb-4 flex gap-7 flex-col">
                <p class="">A worse editor for your documents. <br>It may be not the best editor,
                    but it is surely not the worst. <br>
                    <NuxtLink to="about" class="text-red-500">
                        Or is it? 🤔
                    </NuxtLink>
                </p>
                <h2 class="text-2xl">Welcome {{ user ? user.name : 'Developer' }}!</h2>
            </div>

            <section>
                <Explorer />
            </section>
        </div>
    </main>
</template>