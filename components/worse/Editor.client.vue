<script setup>
import "@/assets/editor.css"
import { Node, mergeAttributes } from '@tiptap/core'
import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-3'
import { Image } from '@tiptap/extension-image'
import { ImageResize } from 'tiptap-extension-resize-image';
import { Collaboration } from '@tiptap/extension-collaboration'
import { CollaborationCursor } from '@tiptap/extension-collaboration-cursor'
import * as Y from 'yjs'
import FontFamily from '@tiptap/extension-font-family'
import { WebsocketProvider } from 'y-websocket'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Underline from '@tiptap/extension-underline'
import TiptapStarterKit from '@tiptap/starter-kit'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import CharacterCount from '@tiptap/extension-character-count'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import { convertToMarkdown, convertToMarkdownWithTags } from "~/util/htmlToMd";





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

const scale = ref(1);
const showDiff = ref(false);

const doc = new Y.Doc()
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'; // TODO: replace with nuxt directive
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
        CharacterCount.configure({
            limit: this.limit,
        }),
        Color,
        BubbleMenu,
        Highlight.configure({ multicolor: true }),
        Underline,
        TaskList,
        TextStyle,
        TaskItem.configure({
            nested: true,
        }),
        // CodeBlockLowlight.configure({
        // lowlight,
        // }),
        Collaboration.configure({
            document: doc,
        }),
        FontFamily,
        // Add a collaboration cursor for each user
        // CollaborationCursor.configure({
        //     provider: provider,
        //     // user: props.user.value,
        //     user: {
        //         name: props.user.name,
        //         color: props.user.color,
        //         id: props.user.id
        //     }
        // }),
        ImageResize,
        Image.configure({
            inline: true,
            allowBase64: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        Table.configure({
            resizable: true,
        }),
        PageBreakNode, // Add the custom extension here
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
            <Tabs value="0" class="sticky top-0 z-50 backdrop-blur-md">
                <TabList class="max-w-full small-tabs">
                    <Tab value="-1">
                        File
                    </Tab>
                    <Tab value="0">
                        Home
                    </Tab>
                    <Tab value="1">
                        Insert
                    </Tab>
                    <Tab value="2">
                        Layout
                    </Tab>
                    <Tab value="3">
                        View
                    </Tab>
                </TabList>
                <TabPanels class="!p-0" v-auto-animate>
                    <TabPanel value="-1">
                        <WorseHeaderFile :editor="editor" :fileName="props.fileName" />
                    </TabPanel>
                    <TabPanel value="0">
                        <WorseHeaderHome :editor="editor" :fileName="props.fileName" />
                    </TabPanel>
                    <TabPanel value="1">
                        <WorseHeaderInsert :editor="editor" :fileName="props.fileName" />
                    </TabPanel>
                    <TabPanel value="2">
                        <WorseHeaderLayout :editor="editor" :fileName="props.fileName" />
                    </TabPanel>
                    <TabPanel value="3">
                        <WorseHeaderView :editor="editor" :fileName="props.fileName" v-model:show-diff="showDiff" />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </slot>
        <div class="w-full flex flex-col xl:flex-row justify-center gap-2 max-w-full overflow-x-auto xl:p-4 2xl:py-8">
            <Card class="px-[4rem] w-[793px]" :style="{ transform: `scale(${scale})`, overflow: 'hidden' }"
                v-if="editor">
                <template #header>
                    <div class="h-10 flex items-center justify-between">
                    </div>
                </template>
                <template #content>
                    <TiptapEditorContent :editor="editor" class="prose prose-editor max-w-[100vw] *:w-full" />
                </template>
            </Card>
            <div class="transition-all w-0" :class="{ 'w-[calc(793px)]': showDiff }">
                <Card class="px-[4rem] w-[calc(793px-4rem)]"
                    :style="{ transform: `scale(${scale})`, overflow: 'hidden' }" v-if="editor && showDiff">
                    <!-- {{ convertToMarkdown(modelValue) }} -->
                    <template #header>
                        <div class="h-10 flex items-center justify-between">
                            <div class="w-full h-0.5 bg-gray-300"></div>
                        </div>
                    </template>
                    <template #content>
                        <div class="prose text-start">
                            <!-- {{ convertToMarkdownWithTags(editor.getHTML()) }} -->
                            <span v-html="convertToMarkdownWithTags(editor.getHTML())"></span>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
        <div class="sticky bottom-0 z-50 backdrop-blur-md">
            <slot name="bottomNav">
                <WorseFooter :editor="editor" :fileName="props.fileName" v-model:scale="scale" />
            </slot>
        </div>
    </div>

</template>

<style>

/* tab */
.small-tabs .p-tab {
    padding: 0.2rem !important;
}
.small-tabs > div > div {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}
/* end tab */


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
</style>