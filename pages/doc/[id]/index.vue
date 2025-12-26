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
const { data: doc } = useAsyncData('doc', () => getDoc(fileName.value), {
    lazy: true,
    watch: [fileName],
});


</script>

<template>
    <main class="mx-auto">
        <div class="">
            <div class="rounded-lg shadow-sm">
                <ClientOnly>
                    <WorseEditor v-model:worseDoc="doc" v-model="content" :fileName="fileName"
                        :user="toYUser(user ? user : fakeUser)" />
                </ClientOnly>
            </div>
        </div>
    </main>
</template>