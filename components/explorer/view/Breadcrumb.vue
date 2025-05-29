<script lang="ts" setup>

const currentPath = defineModel<string>('currentPath');

const pathItems = computed(() => {
    if (!currentPath.value) {
        return [];
    }
    return currentPath.value.split('/').filter(item => item).map((item, index, arr) => {
        return {
            label: item,
            path: '/' + arr.slice(0, index + 1).join('/')
        };
    });
});

</script>

<template>
    <div>
        <div class="flex items-center">
            ~
            <div v-for="(item, index) in pathItems" :key="index" @click="currentPath = item.path">
                <span class="hover:text-blue-500 cursor-pointer">{{ item.label }}</span>
                <span v-if="index < pathItems.length - 1">/</span>
            </div>
        </div>
    </div>
</template>