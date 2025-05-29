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


</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-4">
            <span>
                Explorer
            </span>
            <div class="gap-2 flex">
                <ExplorerCreateDoc :currentPath="currentPath" />
                <Button variant="text" @click="loadMe">
                    <Icon name="mdi:refresh" />
                </Button>
            </div>
        </div>
        <ExplorerViewBreadcrumb v-model:currentPath="currentPath"  />
        <ExplorerViewFolder v-for="folder in splitExplorer(user)" :key="folder.name" :folder="folder"
            v-model:currentPath="currentPath" />
        <!-- <pre>
            <code v-if="user">
                {{ JSON.stringify(splitExplorer(user), null, 2) }}
            </code>
        </pre> -->
    </div>
</template>