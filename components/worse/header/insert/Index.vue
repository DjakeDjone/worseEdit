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

const imageInput = ref<HTMLInputElement | null>(null);
const imageWidth = ref('50%');



const uploadImage = () => {
    if (!imageInput.value) {
        console.error("Image input reference is not set.");
        return;
    }
    imageInput.value.click();
};

const handleImageUpload = (event: any) => {
    const file = event.target!.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const base64String = e.target!.result;
        if (!base64String) {
            console.error("Failed to read image data.");
            return;
        }
        props.editor.value.chain().focus().setImage({ src: base64String, width: imageWidth.value }).run();
    };
    reader.readAsDataURL(file);
};


</script>

<template>
    <WorseHeaderContainer>
        <div class="flex gap-2 px-2">
            <Button severity="secondary" @click="editor.chain().focus().toggleBlockquote().run()"
                :class="{ 'p-button-active': editor.isActive('blockquote') }" v-tooltip.bottom="'Blockquote'">
                <Icon name="mdi:format-quote-open" />
            </Button>

            <Button severity="secondary" @click="editor.chain().focus().setHorizontalRule().run()"
                v-tooltip.bottom="'Horizontal Rule'">
                <Icon name="mdi:minus" />
            </Button>

            <Button severity="secondary" @click="editor.chain().focus().setHardBreak().run()"
                v-tooltip.bottom="'Hard Break'">
                <Icon name="mdi:format-page-break" />
            </Button>

            <Button severity="secondary" @click="editor.chain().focus().setPageBreak().run()"
                v-tooltip.bottom="'Insert Page Break'">
                <Icon name="mdi:file-document-outline" /> <!-- Example icon, choose one you like -->
            </Button>

            <Button severity="secondary" @click="uploadImage()" v-tooltip.bottom="'Add Image'">
                <Icon name="mdi:image-plus" />
                <input type="file" accept="image/*" class="hidden" ref="imageInput" @change="handleImageUpload">
            </Button>
        </div>




        <div class="flex gap-2">
            <Button severity="secondary"
                @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()"
                v-tooltip.bottom="'Insert Table'">
                <Icon name="mdi:table" />
            </Button>
            <Dropdown v-if="editor.isActive('table')" :options="[
                { label: 'Add Column Before', command: () => editor.chain().focus().addColumnBefore().run() },
                { label: 'Add Column After', command: () => editor.chain().focus().addColumnAfter().run() },
                { label: 'Delete Column', command: () => editor.chain().focus().deleteColumn().run() },
                { label: 'Add Row Before', command: () => editor.chain().focus().addRowBefore().run() },
                { label: 'Add Row After', command: () => editor.chain().focus().addRowAfter().run() },
                { label: 'Delete Row', command: () => editor.chain().focus().deleteRow().run() },
                { label: 'Delete Table', command: () => editor.chain().focus().deleteTable().run() }
            ]" placeholder="Table Options" optionLabel="label" @change="(e) => {
                e.value.command()
            }">
                <template #value>
                    <span>Table Options</span>
                </template>
            </Dropdown>
        </div>
    </WorseHeaderContainer>
</template>