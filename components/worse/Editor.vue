<script setup>
import { Image } from '@tiptap/extension-image'
import { ImageResize } from 'tiptap-extension-resize-image';
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'

const modelValue = defineModel()
const emit = defineEmits(['change']);

const imageInput = ref(null);
const imageWidth = ref('50%');

const editor = useEditor({
    content: modelValue.value || "<p>I'm running Tiptap with Vue.js. 🎉</p>",
    extensions: [
        TiptapStarterKit,
        ImageResize,
        Image.configure({
            inline: true,
            allowBase64: true,
        }),
        Table.configure({
            resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell
    ],
    onUpdate({ editor }) {
        modelValue.value = editor.getHTML()
        emit('change', editor.getHTML());
    },
});

const uploadImage = () => {
    imageInput.value.click();
};

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const base64String = e.target.result;
        if (!base64String) {
            console.error("Failed to read image data.");
            return;
        }
        editor.value.chain().focus().setImage({ src: base64String, width: imageWidth.value }).run();
    };
    reader.readAsDataURL(file);
};

onBeforeUnmount(() => {
    unref(editor).destroy();
});
</script>

<template>
    <div class="w-full no-animate">
        <div v-if="editor"
            class="inner-border flex flex-wrap gap-2 mb-2 sticky top-0 bg-white/20 backdrop-blur-lg z-10 rounded-md w-fit p-4">
            <Dropdown :class="{ 'p-button-active': editor.isActive('heading', { level: 1 }) }" :options="[
                { label: 'H1', command: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
                { label: 'H2', command: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
                { label: 'H3', command: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
                { label: 'H4', command: () => editor.chain().focus().toggleHeading({ level: 4 }).run() },
                { label: 'text', command: () => editor.chain().focus().setParagraph().run() },
            ]" placeholder="Heading" optionLabel="label" @change="(e) => {
                e.value.command()
            }" />
            <div class="flex gap-2">
                <Button severity="secondary" @click="editor.chain().focus().toggleBold().run()"
                    :disabled="!editor.can().chain().focus().toggleBold().run()" v-tooltip.bottom="'Bold'"
                    :class="{ 'p-button-active': editor.isActive('bold') }">

                    <Icon name="mdi:format-bold" />

                </Button>
                <Button severity="secondary" @click="editor.chain().focus().toggleItalic().run()"
                    :disabled="!editor.can().chain().focus().toggleItalic().run()" v-tooltip.bottom="'Italic'"
                    :class="{ 'p-button-active': editor.isActive('italic') }">

                    <Icon name="mdi:format-italic" />

                </Button>
                <Button severity="secondary" @click="editor.chain().focus().toggleStrike().run()"
                    :disabled="!editor.can().chain().focus().toggleStrike().run()" v-tooltip.bottom="'Strike Through'"
                    :class="{ 'p-button-active': editor.isActive('strike') }">

                    <Icon name="mdi:format-strikethrough" />

                </Button>
            </div>

            <div class="flex gap-2 px-2">
                <Button severity="secondary" @click="editor.chain().focus().toggleBulletList().run()"
                    :class="{ 'p-button-active': editor.isActive('bulletList') }" v-tooltip.bottom="'Bullet List'">
                    <Icon name="mdi:format-list-bulleted" />
                </Button>
                <Button severity="secondary" @click="editor.chain().focus().toggleOrderedList().run()"
                    :class="{ 'p-button-active': editor.isActive('orderedList') }" v-tooltip.bottom="'Ordered List'">
                    <Icon name="mdi:format-list-numbered" />
                </Button>
            </div>
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

                <Button severity="secondary" @click="uploadImage()" v-tooltip.bottom="'Add Image'">
                    <Icon name="mdi:image-plus" />
                    <input type="file" accept="image/*" class="hidden" ref="imageInput" @change="handleImageUpload">
                </Button>
            </div>

            <!-- Table controls -->
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

            <ButtonGroup class="rounded-full">
                <Button severity="secondary" @click="editor.chain().focus().undo().run()"
                    :disabled="!editor.can().chain().focus().undo().run()" v-tooltip.bottom="'Undo'">
                    <Icon name="mdi:undo" />
                </Button>
                <Button severity="secondary" @click="editor.chain().focus().redo().run()"
                    :disabled="!editor.can().chain().focus().redo().run()" v-tooltip.bottom="'Redo'">
                    <Icon name="mdi:redo" />
                </Button>
            </ButtonGroup>
        </div>
        <TiptapEditorContent :editor="editor" class="prose max-w-[100vw] border-y border-black w-full *:w-full" />
    </div>

</template>

<style>
/* reset margin */
.prose h1,
h2,
p {
    margin: 0 !important;
}

.ProseMirror,
.ProseMirror-focused {
    outline: none !important;
    max-width: unset !important;
    border: none !important;
}

.prose img[src*="base64"] {
    max-width: 100%;
    height: auto;
    border-radius: 1rem;
}

.inner-border>* {
    border-right: 1px solid #00000059;
    display: flex;
    align-items: center;
    padding-right: 0.5rem;
}

.inner-border>*:last-child {
    border-right: none;
}


/* Table styles */
.ProseMirror table {
    border-collapse: collapse;
    table-layout: fixed;
    width: 100%;
    margin: 0;
    overflow: hidden;
}

.ProseMirror table td,
.ProseMirror table th {
    min-width: 1em;
    border: 1px solid #ddd;
    padding: 3px 5px;
    vertical-align: top;
    box-sizing: border-box;
    position: relative;
}

.ProseMirror table th {
    font-weight: bold;
    background-color: hsl(var(--primary-100));
}

.ProseMirror table .selectedCell:after {
    z-index: 2;
    position: absolute;
    content: "";
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(200, 200, 255, 0.4);
    pointer-events: none;
}

.ProseMirror table .column-resize-handle {
    position: absolute;
    right: -2px;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: #adf;
    cursor: col-resize;
    z-index: 20;
}
</style>
