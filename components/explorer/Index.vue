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
    reloadAnimation.value = true;
    try {
        await loadMe();

    } catch (error) {
        console.error('Failed to load user:', error);
        useRouter().push('/login');
    }
    reloadAnimation.value = false;
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
const reloadAnimation = ref(false);

</script>

<template>
    <div class="relative w-[min(44rem,calc(100vw-2rem))]
     resize-x overflow-y-auto h-full flex flex-col md:flex-row gap-4 bg-background-50 shadow-sm p-4 rounded-lg
      border border-gray-400/20 dark:bg-gray-800 dark:text-gray-200
     ">
        <div v-if="reloadAnimation"
            class="absolute inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-gray-900/50">
            <ProgressSpinner />
        </div>
        <div>
            <div class="flex items-center justify-between mb-2">
                <h2 class="font-bold text-lg">WORSE-Files</h2>
            </div>
            <Tabs v-model:value="tab">
                <TabList>
                    <Tab value="recent">
                        <Icon name="mdi:recent" class="mr-1" />
                        Recent
                    </Tab>
                    <Tab value="documents">
                        <Icon name="mdi:folder" class="mr-1" />
                        Documents
                    </Tab>
                </TabList>
            </Tabs>
        </div>
        <div v-auto-animate class="w-full rounded-lg p-2 md:p-4 flex-1 dark:bg-gray-900 dark:text-gray-200">
            <div v-if="tab === 'documents'">
                <div class="flex flex-col md:flex-row gap-2 w-full">
                    <ExplorerViewBreadcrumb v-model:currentPath="currentPath" class="flex-1" />
                    <div class="flex items-center gap-2">
                        <ExplorerCreateDoc :currentPath="currentPath" />
                        <Button variant="text" @click="reload">
                            <Icon name="mdi:refresh" />
                        </Button>
                    </div>
                </div>
                <div class="rounded-lg p-4 min-h-[20rem]">
                    <ExplorerViewFolder v-for="folder, i in splitExplorer(user)" :key="folder.name" :folder="folder"
                        :index="i" @delete="onDelete($event)" v-model:currentPath="currentPath" />
                </div>
            </div>
            <div v-else-if="tab === 'recent'">
                <ExplorerRecent @delete="onDelete">
                    <template #header>
                        <div class="flex flex-col md:flex-row md:items-center justify-between mb-2">
                            <h2 class="text-md font-semibold mb-2">
                                Recent Files
                            </h2>
                            <div class="flex items-center gap-2">
                                <ExplorerCreateDoc :currentPath="currentPath" />
                                <Button variant="text" @click="reload">
                                    <Icon name="mdi:refresh" />
                                </Button>
                            </div>
                        </div>
                    </template>
                </ExplorerRecent>
            </div>
        </div>
    </div>
</template>