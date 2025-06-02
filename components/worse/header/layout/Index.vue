<script setup lang="ts">
import type { DocSettings } from '~/server/model/docSettings';



const props = defineProps({
    editor: {
        type: Object,
        required: true,
    },
    fileName: {
        type: String,
        default: 'public',
    },
    settings: {
        type: Object as () => DocSettings,
        required: true,
    }
})


</script>


<template>
    <WorseHeaderContainer>
        {{ props.settings }}
        <Select></Select>
    </WorseHeaderContainer>
</template>