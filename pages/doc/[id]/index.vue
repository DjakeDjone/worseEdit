<script setup lang="ts">
import { fakeUser, toYUser } from "@/server/model/user";

const { user } = useUserHandler();

const { getDoc } = useDocHelper();


const content = ref("<h1>Worse</h1><p>The better Editor! 🎉</p>");
const route = useRoute();
const fileName = computed(() => {
    return route.params.id ? `${route.params.id}` : "public";
});

// const doc = getDoc(fileName.value);
const { data:doc } = useAsyncData('doc', () => getDoc(fileName.value), {
    lazy: true,
    watch: [fileName],
});


</script>

<template>
    <main class="mx-auto p-4">
        <div class="mb-4 flex items-center justify-between">
            <WorseLogo>
                
            </WorseLogo>
            <h2 class="text-xl">User 
                <span class="bg-green-200">
                    {{ user ? user.name : 'Developer' }}
                </span>
            </h2>
        </div>

        
        <div class="rounded-lg md:p-4 shadow-sm">
            <ClientOnly>
                <WorseEditor v-model:worseDoc="doc" v-model="content" :fileName="fileName" :user="toYUser(user?user:fakeUser)" />
            </ClientOnly>
        </div>
    </main>
</template>