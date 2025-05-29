<script setup lang="ts">
import { generateFileMeta } from '~/server/model/folder';
import type { User } from '~/server/model/user';
import { splitExplorer } from '~/util/folderHelper';

onMounted(() => {
    loadMe();
});

const { user, loadMe } = useUserHandler();
const docHandler = useDocHelper();

const currentPath = ref<string>('/');

const reload = () => {
    currentPath.value = '/';
    user.value = null;
    loadMe();
};

const onDelete = async (id: string) => {
    // remove from user
    if (user.value && user.value.files) {
        user.value.files = user.value.files.filter(file => file.fileId !== id);
        // remove id from currentPath
        currentPath.value = currentPath.value.split('/').filter(part => part !== id).join('/');
    }
};

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
        <slot name="recentFiles">
            <ExplorerRecent @delete="onDelete" />
        </slot>
        <ExplorerViewBreadcrumb v-model:currentPath="currentPath" />
        <div class="rounded-lg p-4 bg-background-50/10 backdrop-blur-2xl">
            <ExplorerViewFolder v-for="folder, i in splitExplorer(user)" :key="folder.name" :folder="folder" :index="i"
                @delete="onDelete($event)" v-model:currentPath="currentPath" />
        </div>
    </div>
</template>