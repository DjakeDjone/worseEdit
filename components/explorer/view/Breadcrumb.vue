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

const isEditing = ref(false);
const editableInput = ref<HTMLInputElement | null>(null);
const editablePath = ref('');

const startEditing = () => {
    isEditing.value = true;
    editablePath.value = currentPath.value || '';
    nextTick(() => {
        editableInput.value?.focus();
        editableInput.value?.select();
    });
};

const confirmEdit = () => {
    const newPath = editablePath.value.trim();
    if (newPath) {
        currentPath.value = newPath.startsWith('/') ? newPath : '/' + newPath;
    }
    isEditing.value = false;
};

const cancelEdit = () => {
    isEditing.value = false;
    editablePath.value = '';
};

const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        confirmEdit();
    } else if (event.key === 'Escape') {
        event.preventDefault();
        cancelEdit();
    }
};

const handleClickOutside = (event: Event) => {
    if (isEditing.value && editableInput.value && !editableInput.value.contains(event.target as Node)) {
        confirmEdit();
    }
};

// onMounted(() => {
//     document.addEventListener('click', handleClickOutside);
// });

// onUnmounted(() => {
//     document.removeEventListener('click', handleClickOutside);
// });

</script>

<template>
    <div>
        <div class="flex items-center border p-1 rounded bg-gray-50">
            <!-- Editing mode -->
            <div v-if="isEditing" class="flex items-center w-full">
                <span class="text-gray-600 mr-1">~</span>
                <input
                    ref="editableInput"
                    v-model="editablePath"
                    @keydown="handleKeyDown"
                    @blur="confirmEdit"
                    class="flex-1 outline-none bg-transparent text-sm"
                    placeholder="Enter path..."
                />
            </div>
            
            <!-- Display mode -->
            <div v-else class="flex items-center w-full cursor-text" @click="startEditing">
                <span class="text-gray-600 mr-1">~</span>
                <div v-if="pathItems.length > 0" class="flex items-center">
                    <div v-for="(item, index) in pathItems" :key="index" class="flex items-center">
                        <span 
                            class="hover:text-blue-500 cursor-pointer px-1 rounded hover:bg-blue-50"
                            @click.stop="currentPath = item.path"
                        >
                            {{ item.label }}
                        </span>
                        <span v-if="index < pathItems.length - 1" class="text-gray-400 mx-1">/</span>
                    </div>
                </div>
                <span v-else class="text-gray-400 text-sm">Click to enter path</span>
            </div>
        </div>
    </div>
</template>