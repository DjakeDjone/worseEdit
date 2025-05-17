<script setup lang="ts">

const props = defineProps({
    center: {
        type: Boolean,
        default: false
    },
})

</script>

<template>
    <div :class="{ 'flex justify-center items-center h-full': center }" class="min-h-screen">
        <slot>
            
        </slot>
    </div>
</template>