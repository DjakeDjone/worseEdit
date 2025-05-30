<script setup lang="ts">
import { Permission } from '~/server/model/permission';


const visible = defineModel<boolean>('visible', {
    default: false,
});

const props = defineProps<{
    docId: string;
}>();

const docHelper = useDocHelper();
const permission = ref<Permission>(Permission.READ);

const permissions = Object.values(Permission).map((p) => ({
    value: p,
}));
const reusable = ref<boolean>(false);

const randLinkId = computed(() => {
    // include permission in the link
    return `${permission.value}/${Math.random().toString(36).substring(2, 15)}`;
});

const linkPrefix = computed(() => {
    return `${window.location.origin}/doc/${props.docId}/shared/`;
});

const copyToClipboard = () => {
    const text = `${linkPrefix.value}${randLinkId.value}`;
    navigator.clipboard.writeText(text).then(() => {
        // Optionally, you can show a success message
        console.log('Link copied to clipboard:', text);
    }).catch((err) => {
        console.error('Failed to copy link:', err);
    });
};

const errorMsg = ref<string | null>(null);

const shareDoc = async () => {
    try {
        await docHelper.shareDoc(props.docId, randLinkId.value, permission.value, reusable.value);
        visible.value = false;
        console.log('Document shared successfully');
        copyToClipboard();
    } catch (error) {
        console.error('Error sharing document:', error);
        errorMsg.value = 'Failed to share document. Please try again.';
    }
};

</script>


<template>
    <div>
        <Button @click="visible = true" severity="info" outlined rounded size="small" class="!py-1">
            Share
            <Icon name="mdi:share" />
        </Button>
        <Dialog v-model:visible="visible" modal header="Share Document" class="m-2">
            <div class="w-full max-w-sm">
                <p class="text-sm text-gray-600 mb-4">
                    Share this document with others by providing them the link. You can set the permission level for the
                    shared link.
                </p>

                <div class="flex items-center mb-4 gap-2 justify-between">

                    <ToggleButton v-model="reusable" onLabel="reusable" offLabel="one-time link" />

                    <Select v-model="permission" :options="permissions" option-label="value" option-value="value" fluid
                        class="max-w-44">
                    </Select>
                </div>

                <div class="flex gap-2 items-center">
                    <InputText disabled class="text-nowrap border p-2 rounded-md bg-gray-100 overflow-x-auto"
                        @click="copyToClipboard" :value="`${linkPrefix}${randLinkId}`" fluid>
                        {{ linkPrefix }}{{ randLinkId }}
                    </InputText>
                    <Button @click="copyToClipboard" severity="primary" size="large">
                        <Icon name="mdi:content-copy" />
                    </Button>
                </div>
                <Button @click="shareDoc()" severity="secondary" class="mt-4 w-full">
                    Create Link
                    <Icon name="mdi:link" />
                </Button>
                <p v-if="errorMsg" class="text-red-500 mt-2 text-center">{{ errorMsg }}</p>
            </div>
        </Dialog>
    </div>
</template>