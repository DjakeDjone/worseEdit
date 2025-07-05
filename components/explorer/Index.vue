<script setup lang="ts">
import { generateFileMeta } from '~/server/model/folder';
import type { User } from '~/server/model/user';
import { splitExplorer } from '~/util/folderHelper';

onMounted(() => {
    reload();
});

const { user, loadMe } = useUserHandler();
const docHandler = useDocHelper();

const currentPath = ref<string>('');

const reload = async () => {
    currentPath.value = '';
    try {
        await loadMe();

    } catch (error) {
        console.error('Failed to load user:', error);
        useRouter().push('/login');
    }
};

const onDelete = async (id: string) => {
    // remove from user
    if (user.value && user.value.files) {
        user.value.files = user.value.files.filter(file => file.fileId !== id);
        // remove id from currentPath
        currentPath.value = currentPath.value.split('/').filter(part => part !== id).join('/');
    }
};

const tab = ref('recent');

</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-4">
            <h2>
                Explorer
            </h2>
            <div class="gap-2 flex">
                <ExplorerCreateDoc :currentPath="currentPath" />
                <Button variant="text" @click="reload">
                    <Icon name="mdi:refresh" />
                </Button>
            </div>
        </div>
        <!-- <slot name="recentFiles">
            <ExplorerRecent @delete="onDelete" />
        </slot> -->
        <div class="flex gap-4 bg-background-50 p-4 rounded-lg">
            <div>
                <div class="flex items-center justify-between mb-2">
                    <h2 class="font-bold">Files</h2>
                </div>
                <ul class="*:flex *:items-center *:gap-2 *:cursor-pointer">
                    <li @click="tab = 'recent'" :class="{ 'text-blue-500': tab === 'recent' }">
                        <Icon name="mdi:recent" />
                        Recent
                    </li>
                    <li @click="tab = 'documents'" :class="{ 'text-blue-500': tab === 'documents' }">
                        <Icon name="mdi:folder" />
                        Documents
                    </li>
                </ul>
            </div>
            <div v-auto-animate class="bg-white w-full rounded-lg shadow-sm p-2">
                <div v-if="tab === 'documents'">
                    <ExplorerViewBreadcrumb v-model:currentPath="currentPath" />
                    <div class="rounded-lg p-4 min-h-[20rem]">
                        <ExplorerViewFolder v-for="folder, i in splitExplorer(user)" :key="folder.name" :folder="folder"
                            :index="i" @delete="onDelete($event)" v-model:currentPath="currentPath" />
                    </div>
                </div>
                <div v-else-if="tab === 'recent'">
                    <ExplorerRecent @delete="onDelete" />
                </div>
            </div>
        </div>
    </div>
</template>