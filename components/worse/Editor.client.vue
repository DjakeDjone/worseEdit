<script setup>
import "@/assets/editor.css";
import { Image } from '@tiptap/extension-image'
import { ImageResize } from 'tiptap-extension-resize-image';
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import { Collaboration } from '@tiptap/extension-collaboration'
import { CollaborationCursor } from '@tiptap/extension-collaboration-cursor'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { Node, mergeAttributes } from '@tiptap/core'

// Custom Page Break Extension
const PageBreakNode = Node.create({
    name: 'pageBreak',
    group: 'block',
    atom: true,

    parseHTML() {
        return [
            {
                tag: 'hr[data-type="page-break"]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        // Note: Add styling for '.page-break-indicator' in your editor.css
        return ['hr', mergeAttributes(HTMLAttributes, { 'data-type': 'page-break', class: 'page-break-indicator' })]
    },

    addCommands() {
        return {
            setPageBreak: () => ({ commands }) => {
                return commands.insertContent({ type: this.name })
            },
        }
    },
})

const modelValue = defineModel()
const props = defineProps({
    fileName: {
        type: String,
        default: 'public'
    },
    user: {
        type: Object,
        default: () => ({
            name: 'Tip',
            color: '#000000',
            id: Math.floor(Math.random() * 100)
        })
    }
})
const emit = defineEmits(['change']);

const imageInput = ref(null);
const imageWidth = ref('50%');

const doc = new Y.Doc()
const provider = new WebsocketProvider(`ws://${location.host}/api/editor/live`, props.fileName, doc)
// const provider = new WebsocketProvider(`ws://localhost:1234`, 'init', doc)

provider.on('status', (event) => {
    if (event.status === 'disconnected') {
        // Handle disconnection, possibly an error or server down
        console.error('WebSocket disconnected. Redirecting to /notFound');
        useRouter().push('/notFound');
    }
})


const editor = useEditor({
    content: modelValue.value || "<p>I'm running Tiptap with Vue.js. 🎉</p>",
    extensions: [
        TiptapStarterKit.configure({
            // The Collaboration extension comes with its own history handling
            history: false,
        }),
        Collaboration.configure({
            document: doc,
        }),
        // Add a collaboration cursor for each user
        CollaborationCursor.configure({
            provider: provider,
            // user: props.user.value,
            user: {
                name: props.user.name,
                color: props.user.color,
                id: props.user.id
            }
        }),
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
        TableCell,
        PageBreakNode, // Add the custom extension here
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
    provider.destroy();
});
</script>

<template>
    <div class="w-full no-animate">
        <slot name="editor-actions">
            <div id="editor-actions" v-if="editor"
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
                        :disabled="!editor.can().chain().focus().toggleStrike().run()"
                        v-tooltip.bottom="'Strike Through'" :class="{ 'p-button-active': editor.isActive('strike') }">

                        <Icon name="mdi:format-strikethrough" />

                    </Button>
                </div>

                <div class="flex gap-2 px-2">
                    <Button severity="secondary" @click="editor.chain().focus().toggleBulletList().run()"
                        :class="{ 'p-button-active': editor.isActive('bulletList') }" v-tooltip.bottom="'Bullet List'">
                        <Icon name="mdi:format-list-bulleted" />
                    </Button>
                    <Button severity="secondary" @click="editor.chain().focus().toggleOrderedList().run()"
                        :class="{ 'p-button-active': editor.isActive('orderedList') }"
                        v-tooltip.bottom="'Ordered List'">
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

                    <Button severity="secondary" @click="editor.chain().focus().setPageBreak().run()"
                        v-tooltip.bottom="'Insert Page Break'">
                        <Icon name="mdi:file-document-outline" /> <!-- Example icon, choose one you like -->
                    </Button>

                    <Button severity="secondary" @click="uploadImage()" v-tooltip.bottom="'Add Image'">
                        <Icon name="mdi:image-plus" />
                        <input type="file" accept="image/*" class="hidden" ref="imageInput" @change="handleImageUpload">
                    </Button>
                </div>

                <!-- <ButtonGroup>
                    <Button severity="secondary" @click="editor.chain().focus().setTextAlign('left').run()"
                        :class="{ 'p-button-active': editor.isActive({ textAlign: 'left' }) }"
                        v-tooltip.bottom="'Align Left'">
                        <Icon name="mdi:format-align-left" />
                    </Button>
                    <Button severity="secondary" @click="editor.chain().focus().setTextAlign('center').run()"
                        :class="{ 'p-button-active': editor.isActive({ textAlign: 'center' }) }"
                        v-tooltip.bottom="'Align Center'">
                        <Icon name="mdi:format-align-center" />
                    </Button>
                    <Button severity="secondary" @click="editor.chain().focus().setTextAlign('right').run()"
                        :class="{ 'p-button-active': editor.isActive({ textAlign: 'right' }) }"
                        v-tooltip.bottom="'Align Right'">
                        <Icon name="mdi:format-align-right" />
                    </Button>
                </ButtonGroup> -->

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
        </slot>
        <div class="w-full flex justify-center">
            <Card class="px-[4rem] w-[793px]">
                <template #header>
                    <div class="h-10 flex items-center justify-between">

                    </div>
                </template>
                <template #content>
                    <TiptapEditorContent :editor="editor" class="prose max-w-[100vw] *:w-full" />
                </template>
            </Card>
        </div>
    </div>

</template>

<style>
.page-break-indicator {
    border: none;
    /* border-top: 1px dashed #000; */
    /* Change this to your desired style */
    margin: 20px 0;
    /* Adjust spacing as needed */
    text-align: center;
    padding: 1rem 0;
    width: 793px;
    /* TODO: replace with variable */
    position: relative;
    left: -5.3rem;
    --tw-shadow: 0 1px 3px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
    /* box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow); */

    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.2), 0 -2px 2px -1px rgba(0, 0, 0, 0.2);
}

.page {
    height: 100vh;
    /* Replace with number */

}
</style>