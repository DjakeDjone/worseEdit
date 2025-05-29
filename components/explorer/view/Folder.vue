<script lang="ts" setup>
import type { FileMeta } from '~/server/model/folder';
import type { Folder } from '~/util/folderHelper';


const props = defineProps<{
    folder: Folder;
    index: number;
}>();

const emit = defineEmits<{
    (e: 'delete', file: FileMeta): void;
}>();

const currentPath = defineModel<string>('currentPath');
const opened = ref(false);

</script>

<template>
    <div v-auto-animate>
        <h3 class="underline cursor-pointer flex items-center gap-1"
            :class="{ 'text-blue-500': currentPath === folder.path }"
            @click="currentPath = folder.path; opened = !opened">
            <Icon name="line-md:folder-filled" class="" />
            <span>
                {{ folder.name }}
            </span>
        </h3>
        <ul class="pl-1 overflow-hidden" v-if="opened">
            <li v-for="subFolder in folder.children" :key="subFolder.name" class="flex">
                <Icon name="clarity:child-arrow-line" />
                <ExplorerViewFolder :folder="subFolder" v-model:current-path="currentPath" :index="index" />
            </li>
            <li v-for="file in folder.files" :key="file.name" class="flex gap-2 pl-1">
                <Icon name="clarity:child-arrow-line" />
                <div class="grid sm:grid-cols-2 md:grid-cols-3 gap-2 items-center hover:outline-1 outline-gray-300 rounded m-1 p-1 w-full">
                    <span>
                        <Icon name="mdi:file-document" class="inline-block mr-1" />
                        {{ file.name }}
                    </span>
                    <div class="text-xs text-gray-500">
                        <!-- TODO: fmt date -->
                        <!-- {{ file.lastEdited }} - -->
                        <NuxtTime v-if="file.lastEdited" :datetime="file.lastEdited" />
                        <span class="ml-2 text-[.7rem] opacity-85 rounded-full border p-1">
                            {{file.permissions.map(p => p.userId).length}} users
                        </span>
                    </div>
                    <div class="flex gap-2 float-end justify-end">
                        <NuxtLink :to="`/doc/${file.fileId}`" class="flex items-center">
                            <Button variant="text" size="small">
                                <Icon name="mdi:open-in-new" />
                            </Button>
                        </NuxtLink>
                        <Button variant="text" severity="danger" @click="$emit('delete', file)" size="small">
                            <Icon name="mdi:delete" />
                        </Button>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>