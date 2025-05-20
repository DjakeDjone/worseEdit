<script setup lang="ts">

const props = defineProps({
    editor: {
        type: Object,
        required: true,
    },
    fileName: {
        type: String,
        default: 'public',
    },
})

const showDiff = defineModel('showDiff')


</script>


<template>
    <WorseHeaderContainer>
        <Button @click="showDiff = !showDiff" v-tooltip.bottom="'Show Diff'">
            <Icon name="mdi:compare" />
        </Button>
    </WorseHeaderContainer>
</template>