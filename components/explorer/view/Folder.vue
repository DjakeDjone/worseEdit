<script lang="ts" setup>
import type { FileMeta } from '~/server/model/folder';
import type { Folder } from '~/util/folderHelper';


const props = defineProps<{
    folder: Folder;
}>();

const emit = defineEmits<{
    (e: 'delete', file: FileMeta): void;
}>();

const currentPath = defineModel<string>('currentPath');
const opened = ref(false);

</script>

<template>
    <div v-auto-animate>
        <h3 class="underline cursor-pointer"
            :class="{ 'text-blue-500': currentPath === folder.path }"
        @click="currentPath = folder.path; opened = !opened"
        >
            {{ folder.name }} Folder
        </h3>
        <ul class="list-disc pl-5 overflow-hidden" v-if="opened">
            <li v-for="subFolder in folder.children" :key="subFolder.name">
                <ExplorerViewFolder :folder="subFolder" v-model:current-path="currentPath" />
            </li>
            <li v-for="file in folder.files" :key="file.name">
                <span>
                    {{ file.name }}
                </span>
                <div class="text-xs text-gray-500">
                    <!-- TODO: fmt date -->
                    {{ file.lastEdited }} - 
                    <span>
                        {{ file.permissions.map(p => p.userId).length }} users
                    </span>
                </div>
                <div class="flex gap-2">
                    <NuxtLink :to="`/doc/${file.fileId}`" class="flex items-center">
                        <Button variant="text">
                            <Icon name="mdi:open-in-new" />
                        </Button>
                    </NuxtLink>
                    <Button variant="text" @click="$emit('delete', file)">
                        <Icon name="mdi:delete" />
                    </Button>
                </div>
            </li>
        </ul>
    </div>
</template>