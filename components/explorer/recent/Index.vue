<script setup lang="ts">

const { user, loadMe } = useUserHandler();

const { deleteDoc } = useDocHelper();

const count = ref(5);

const recentFiles = computed(() => {
    if (!user.value || !user.value.files) return [];
    return user.value.files
        .filter(file => file.lastEdited)
        .slice(0, count.value);
});

const emit = defineEmits<{
    (e: 'delete', id: string): void;
}>();

const deleteFile = async (id: string) => {
    try {
        await deleteDoc(id);
        emit('delete', id);
    } catch (error) {
        console.error('Failed to delete file:', error);
    }
};

</script>

<template>
    <div>
        <div class="mb-4">
            <h2 class="text-lg font-semibold mb-2">
                <slot name="header">>
                    Recent Files
                </slot>
            </h2>
            <DataTable :value="recentFiles" stripedRows showGridlines resizableColumns columnResizeMode="fit">
                <Column field="name" header="Name" sortable frozen>
                    <template #body="slotProps">
                        <NuxtLink :to="`/doc/${slotProps.data.fileId}`" class="text-primary-500 hover:underline">
                            {{ slotProps.data.name }}
                        </NuxtLink>

                    </template>
                </Column>
                <Column field="lastEdited" header="Last Edited" sortable>
                    <template #body="slotProps">
                        <NuxtTime v-if="slotProps.data.lastEdited" :datetime="slotProps.data.lastEdited" />
                    </template>
                </Column>
                <Column header="Actions">
                    <template #body="slotProps">
                        <Button severity="danger" variant="text" @click="deleteFile(slotProps.data.fileId)" size="small">
                            <Icon name="mdi:delete" />
                        </Button>
                        <NuxtLink :to="`/doc/${slotProps.data.fileId}`" class="ml-2">
                            <Button variant="text">
                                <Icon name="mdi:open-in-new" />
                            </Button>
                        </NuxtLink>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
