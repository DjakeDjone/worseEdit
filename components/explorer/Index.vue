<script setup lang="ts">
import { generateFileMeta } from '~/server/model/folder';
import type { User } from '~/server/model/user';


const { user, loadMe } = useUserHandler();
const docHandler = useDocHelper();

const splitExplorer = (user: User) => {
}

</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-4">
            <span>
                Explorer
            </span>
            <div class="gap-2 flex">
                <ExplorerCreateDoc></ExplorerCreateDoc>
                <Button variant="text" @click="loadMe">
                    <Icon name="mdi:refresh" />
                </Button>
            </div>
        </div>
        <pre>
            <code>
                {{ user }}
            </code>
        </pre>
    </div>
</template>