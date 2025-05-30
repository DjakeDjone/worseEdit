<script setup lang="ts">
import { Permission } from '~/server/model/permission';


const route = useRoute();
const docId = route.params.id as string;
const shareLink = route.params.shareLink as string;
const permissions = route.params.permissions as string;

const docHelper = useDocHelper();

const errorMsg = ref<Error | null>(null);

const acceptShare = async () => {
    try {
        const permission = permissions as Permission; // Cast to Permission type
        await docHelper.acceptShareLink(docId, permission, shareLink);
        navigateTo(`/doc/${docId}`);
    } catch (error: any) {
        console.error('Error accepting share:', error.data.message);
        errorMsg.value = error.data || 'Failed to accept share. Please try again.';
        // Handle error, e.g., show an error message
    }
};

onMounted(() => {
    acceptShare();
});

</script>


<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <!-- {{ docId }} - {{ shareLink }} - {{ permissions }} -->
        <h1 class="text-2xl font-bold mb-4" v-if="!errorMsg">Checking<Icon name="svg-spinners:3-dots-fade" class="-mb-3" />
        </h1>
        <p class="text-lg mb-4" v-if="!errorMsg">Please wait while we process your request...</p>

        <div v-if="errorMsg" class="text-center text-red-500">
            <h2 class="text-2xl font-bold mb-2">Error</h2>
            <p>
                {{ errorMsg.message }}
            </p>
            <NuxtLink to="/">
                <Button severity="secondary" class="mt-4">Go to Home</Button>
            </NuxtLink>

        </div>
    </div>
</template>