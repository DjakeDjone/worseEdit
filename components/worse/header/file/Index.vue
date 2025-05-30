<script setup lang="ts">
import type { FileUploadUploadEvent } from 'primevue/fileupload';
import { convertToMarkdown } from '~/util/htmlToMd';
// import docx2html from "docx2html/lib/";
import MarkdownIt from 'markdown-it';



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

const downloadFile = (content: string, fileName: string, fileType: string) => {
    const blob = new Blob([content], { type: fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
};

const downloadAsHTML = () => {
    const html = props.editor.getHTML();
    downloadFile(html, `${props.fileName}.html`, 'text/html');
};

const downloadAsMarkdown = () => {
    const html = props.editor.getHTML();
    const markdown = convertToMarkdown(html);
    downloadFile(markdown, `${props.fileName}.md`, 'text/markdown');
};

const uploadFile = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files || target.files.length === 0) {
        alert('No file selected');
        return;
    }
    let file = target.files[0];
    const fileName = file.name;
    const fileType = file.type;

    console.log('fileName', fileName);

    const fileContent = await file.text();

    if (fileName.endsWith('.html')) {
        props.editor.commands.setContent(fileContent as string);
    } else if (fileName.endsWith('.md')) {
        const md = new MarkdownIt();
        props.editor.commands.setContent(md.render(fileContent as string));
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
        // Handle Word document upload
        try {
            // const html = await docx2html(file);
            // console.log('Converted HTML:', html);
            // props.editor.commands.setContent(html.toString());
        } catch (error) {
            console.error('Error converting DOCX to HTML:', error);
            alert('Error processing Word document.');
        }
    } else {
        alert('Unsupported file type. Please upload an HTML or Markdown file.');
    }

};

</script>

<template>
    <WorseHeaderContainer>
        <Button @click="downloadAsHTML()" v-tooltip.bottom="'Download as HTML'">
            <Icon name="mdi:download" />
        </Button>

        <Button @click="downloadAsMarkdown()" v-tooltip.bottom="'Download as Markdown'">
            <Icon name="mdi:markdown" />
        </Button>

        <input type="file" @change="uploadFile($event)" v-tooltip.bottom="'Upload File'"
            accept=".html,.md,.docx,.doc" />
    </WorseHeaderContainer>
</template>