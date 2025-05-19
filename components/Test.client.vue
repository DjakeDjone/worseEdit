<script setup>
import "@/assets/editor.css"
// import { Node, mergeAttributes } from '@tiptap/core'
// import { Editor, EditorContent } from '@tiptap/vue-3'
// import { Image } from '@tiptap/extension-image'
// import { ImageResize } from 'tiptap-extension-resize-image';
import { Collaboration } from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Underline from '@tiptap/extension-underline'
import TiptapStarterKit from '@tiptap/starter-kit'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'


// for code highlighting
// import css from 'highlight.js/lib/languages/css'
// import js from 'highlight.js/lib/languages/javascript'
// import ts from 'highlight.js/lib/languages/typescript'
// import html from 'highlight.js/lib/languages/xml'

// // create a lowlight instance
// const lowlight = createLowlight(all)

// // you can also register languages
// lowlight.register('html', html)
// lowlight.register('css', css)
// lowlight.register('js', js)
// lowlight.register('ts', ts)


// Custom Page Break Extension
// const PageBreakNode = Node.create({
//     name: 'pageBreak',
//     group: 'block',
//     atom: true,

//     parseHTML() {
//         return [
//             {
//                 tag: 'hr[data-type="page-break"]',
//             },
//         ]
//     },

//     renderHTML({ HTMLAttributes }) {
//         // Note: Add styling for '.page-break-indicator' in your editor.css
//         return ['hr', mergeAttributes(HTMLAttributes, { 'data-type': 'page-break', class: 'page-break-indicator' })]
//     },

//     addCommands() {
//         return {
//             setPageBreak: () => ({ commands }) => {
//                 return commands.insertContent({ type: this.name })
//             },
//         }
//     },
// })

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
let protocol = 'ws:'; // Default to ws
if (import.meta.client) {
    protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'; // TODO: replace with nuxt directive
}
const provider = new WebsocketProvider(`${protocol}//${location.host}/api/editor/live`, props.fileName, doc)
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
        Underline,
        TaskList,
        TaskItem.configure({
            nested: true,
        }),
        // CodeBlockLowlight.configure({
        // lowlight,
        // }),
        Collaboration.configure({
            document: doc,
        }),
        // CollaborationCursor.configure({
        //     provider: provider,
        //     user: {
        //         name: 'Cyndi Lauper',
        //         color: '#f783ac',
        //     },
        // }),
        // CollaborationCursor.configure({
        // provider: provider,
        // // user: props.user.value,
        // user: {
        // name: props.user.name,
        // color: props.user.color,
        // id: props.user.id
        // }
        // }),
        // ImageResize,
        // Image.configure({
        //     inline: true,
        //     allowBase64: true,
        // }),
        TableRow,
        TableHeader,
        TableCell,
        Table.configure({
            resizable: true,
            allowTableNodeSelection: true,
            cellContent: true,
            cellAttributes: true,
            allowBackgroundColor: true,
            allowTableCellAttributes: true,
            allowTableHeaderAttributes: true,
            allowTableRowAttributes: true,
        }),
        // PageBreakNode, // Add the custom extension here
    ],
    onUpdate({ editor }) {
        modelValue.value = editor.getHTML()
        emit('change', editor.getHTML());
    },
});

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

                <!-- <ButtonGroup class="rounded-full">
                    <Button severity="secondary" @click="editor.chain().focus().undo().run()"
                        :disabled="!editor.can().chain().focus().undo().run()" v-tooltip.bottom="'Undo'">
                        <Icon name="mdi:undo" />
                    </Button>
                    <Button severity="secondary" @click="editor.chain().focus().redo().run()"
                        :disabled="!editor.can().chain().focus().redo().run()" v-tooltip.bottom="'Redo'">
                        <Icon name="mdi:redo" />
                    </Button>
                </ButtonGroup> -->
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
    width: 794px;
    /* TODO: replace with variable */
    position: relative;
    left: -84px;
    --tw-shadow: 0 1px 3px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
    /* box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow); */

    box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.2), 0 -2px 2px -1px rgba(0, 0, 0, 0.2);
}

.page {
    height: 100vh;
    /* Replace with number */
}

/* checkboxes li flex */
ul[data-type="taskList"] {
    list-style: none;
    padding: 0;
}

ul[data-type="taskList"] li {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
}

ul[data-type="taskList"] li label {
    cursor: pointer;
    padding-top: .5rem !important;

}

ul[data-type="taskList"] li input[type="checkbox"] {
    cursor: pointer;
    width: 1rem;
    height: 1rem;
}

/* checkboxes li flex */
ul[data-type="taskList"] {
    list-style: none;
    padding: 0;
}

ul[data-type="taskList"] li {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    gap: 0.5rem;
}

ul[data-type="taskList"] li label {
    cursor: pointer;
    padding-top: .5rem !important;

}

ul[data-type="taskList"] li input[type="checkbox"] {
    cursor: pointer;
    width: 1rem;
    height: 1rem;
}

/* collaboration cursor */
.tiptap {
    :first-child {
        margin-top: 0;
    }

    /* Placeholder (at the top) */
    p.is-editor-empty:first-child::before {
        color: var(--gray-4);
        content: attr(data-placeholder);
        float: left;
        height: 0;
        pointer-events: none;
    }

    p {
        word-break: break-all;
    }

    /* Give a remote user a caret */
    .collaboration-cursor__caret {
        border-left: 1px solid #0d0d0d;
        border-right: 1px solid #0d0d0d;
        margin-left: -1px;
        margin-right: -1px;
        pointer-events: none;
        position: relative;
        word-break: normal;
    }

    /* Render the username above the caret */
    .collaboration-cursor__label {
        border-radius: 3px 3px 3px 0;
        color: #0d0d0d;
        font-size: 12px;
        font-style: normal;
        font-weight: 600;
        left: -1px;
        line-height: normal;
        padding: 0.1rem 0.3rem;
        position: absolute;
        top: -1.4em;
        user-select: none;
        white-space: nowrap;
    }
}
</style>