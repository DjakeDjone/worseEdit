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

const editableContainerRef = ref<HTMLElement | null>(null);
const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (editableContainerRef.value) {
            const newPath = editableContainerRef.value.textContent?.trim() || '';
            if (newPath) {
                currentPath.value = newPath;
            }
            // replace the content with the new path
            Array.from(editableContainerRef.value.children).forEach(child => {
                if (child.nodeType === Node.TEXT_NODE) {
                    child.textContent = '';
                } else if (child instanceof HTMLElement) {
                    child.textContent = '';
                }
            });
        }
    }
};

</script>

<template>
    <div>
        {{ currentPath }}
        <div class="flex items-center border p-1" ref="editableContainerRef" @keydown="handleKeyDown">
            ~
            <div v-for="(item, index) in pathItems" :key="index" @click="currentPath = item.path">
                <span class="hover:text-blue-500 cursor-pointer">{{ item.label }}</span>
                <span v-if="index < pathItems.length - 1">/</span>
            </div>
        </div>
    </div>
</template>