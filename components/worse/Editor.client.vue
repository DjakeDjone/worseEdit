<script setup lang="ts">
import "@/assets/editor.css"
import { Node, mergeAttributes, type Commands, type RawCommands, Editor } from '@tiptap/vue-3'
import { EditorContent, BubbleMenu } from '@tiptap/vue-3'
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

// auto focus
import { useFocus } from '@vueuse/core'





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
            setPageBreak: () => ({ commands }: { commands: RawCommands }) => {
                return commands.insertContent({ type: this.name })
            },
        } as Partial<RawCommands>
    },
})

// suggestion extension
const completionNode = Node.create({
    name: 'completion',
    group: 'block',
    atom: true,
    selectable: true,
    draggable: true,

    addAttributes() {
        return {
            text: {
                default: '',
                parseHTML: (element: { getAttribute: (arg0: string) => any; innerText: any; }) => element.getAttribute('data-completion-text') || element.innerText,
                renderHTML: (attributes: { text: string }) => {
                    return { 'data-completion-text': attributes.text };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="completion"]',
            },
        ];
    },

    renderHTML({ node, HTMLAttributes }: { node: any, HTMLAttributes: Record<string, any> }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'completion' }), node.attrs.text || ''];
    },

    addCommands() {
        return {
            setCompletion: (text: string) => ({ commands, editor }: { commands: RawCommands, editor: Editor }) => {
                if (!editor) {
                    console.warn('Editor instance is not available.');
                    return false;
                }
                if (editor.isActive(this.name)) {
                    return commands.updateAttributes(this.name, { text: text || '' });
                } else {
                    return commands.insertContent({
                        type: this.name,
                        attrs: { text: text || '' },
                    });
                }
            },
        } as Partial<RawCommands>;
    },

    addKeyboardShortcuts() {
        return {
            // Mod-Enter will insert/update an empty completion block at the current position.
            'Mod-Enter': () => (this.editor.commands as any).setCompletion(''),
            'Enter': () => (this.editor.commands as any).setCompletion(''),
        };
    },
})

const editorRef = shallowRef<Editor | undefined>()
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
    },
})
const emit = defineEmits(['change']);
const worseDoc = defineModel("worseDoc");

const scale = ref(1);
const showDiff = ref(false);

const doc = new Y.Doc()
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'; // TODO: replace with nuxt directive
const provider = new WebsocketProvider(`${protocol}//${location.host}/api/editor/live`, props.fileName, doc)
// const provider = new WebsocketProvider(`ws://localhost:1234`, 'init', doc)

provider.on('status', (event: any) => {
    if (event.status === 'disconnected') {
        // check if it was a disconnection or an error
        if (event.error) {
            // Handle error
            console.error('WebSocket error:', event.error);
            useRouter().push('/notFound?message=WebSocket connection error');
        } else {
            // Handle disconnection
            console.warn('WebSocket disconnected');
        }
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
            limit: null,
        }),
        Color,
        // BubbleMenu, // Removed from extensions
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
        PageBreakNode, // my custom extension
        completionNode, // my custom extension
    ],
    onUpdate({ editor }) {
        modelValue.value = editor.getHTML()
        emit('change', editor.getHTML());
    },
});

watch(editor, (newEditor) => {
    editorRef.value = newEditor;
});

onBeforeUnmount(() => {
    try {
        const currentEditor = unref(editor);
        if (currentEditor) {
            currentEditor.destroy();
        }
        if (provider) {
            unref(provider).destroy();
        }
    } catch (error) {
        console.error('Error during unmount:', error);
    }
});

const tabsCompact = ref(false);

</script>

<template>
    <div class="w-full">
        <slot name="editor-actions" v-if="editor">
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
                    <Tab value="4">
                        AI
                    </Tab>
                    <Button variant="text" @click="tabsCompact = !tabsCompact">
                        <Icon name="i-heroicons-chevron-double-left-solid" class="transition-all"
                            :class="{ 'rotate-180': tabsCompact }" />
                    </Button>
                    <div class="ml-auto">
                        <WorseHeaderShare :docId="fileName" />
                    </div>
                </TabList>
                <TabPanels :class="{ '!h-0': tabsCompact }" class="!p-0 overflow-hidden h-16 transition-all"
                    v-auto-animate>
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
                        <!-- <WorseHeaderLayout :settings="props.worseDoc.settings" :editor="editor" :fileName="props.fileName" /> -->
                    </TabPanel>
                    <TabPanel value="3">
                        <WorseHeaderView :editor="editor" :fileName="props.fileName" v-model:show-diff="showDiff" />
                    </TabPanel>
                    <TabPanel value="4">
                        <WorseHeaderAi v-if="editorRef" :editor="editorRef" :fileName="props.fileName" />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </slot>
        <div class="w-full flex flex-col xl:flex-row justify-center gap-2 max-w-full overflow-x-auto xl:p-4 2xl:py-8">
            <Card class="px-[4rem] w-[793px] min-h-screen" :style="{ transform: `scale(${scale})`, overflow: 'hidden' }"
                v-if="editor">
                <template #header>
                    <div class="h-10 flex items-center justify-between">
                    </div>
                </template>
                <template #content>
                    <TiptapEditorContent :editor="editor" class="scheme-light prose prose-editor max-w-[100vw] *:w-full" />
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
            <slot name="bottomNav" v-if="editor">
                <WorseFooter focus :editor="editor" :fileName="props.fileName" v-model:scale="scale" />
            </slot>
        </div>
    </div>

</template>

<style>
/* tab */
.small-tabs .p-tab {
    padding: 0.2rem !important;
}

.small-tabs>div>div {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

/* end tab */
/* completion */
div[data-type="completion"] {
    opacity: 0.9;
}

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