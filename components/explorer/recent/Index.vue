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
                Recent Files
            </h2>
            <!-- <table class="w-full">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Last Edited</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="file in recentFiles" :key="file.fileId">
                        <td>
                            <div class="flex gap-1 items-center">
                                <Icon name="mdi:file-document" />
                                <span>{{ file.name }}</span>
                            </div>
                        </td>
                        <td>
                            <NuxtTime v-if="file.lastEdited" :datetime="file.lastEdited" />
                        </td>
                    </tr>
                </tbody>
            </table> -->
            <DataTable :value="recentFiles" stripedRows showGridlines resizableColumns columnResizeMode="fit">
                <Column field="name" header="Name" sortable frozen></Column>
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
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>
