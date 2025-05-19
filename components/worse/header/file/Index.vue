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

const downloadAsHTML = () => {
    const html = props.editor.getHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${props.fileName}.html`;
    a.click();
    URL.revokeObjectURL(url);
};

</script>

<template>
    <WorseHeaderContainer>
        <Button @click="downloadAsHTML()" v-tooltip.bottom="'Download as HTML'">
            <Icon name="mdi:download" />
        </Button>
    </WorseHeaderContainer>
</template>