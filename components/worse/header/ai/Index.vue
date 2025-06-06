<script setup lang="ts">
import { Ollama } from 'ollama/browser';
import type { ShallowRef } from 'vue';
import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-3'


const props = defineProps({
    editor: {
        type: Object as () => Editor,
        required: true,
    },
    fileName: {
        type: String,
        default: 'public',
    },
    // pageRef: {
    //     type: Object as () => HTMLElement | null,
    //     required: true,
    // },
});

const ops = ref({
    provider: 'ollama',
    model: 'gemma3:latest',
    baseUrl: 'http://127.0.0.1:11434',
});

const streamResponse = ref<string>('');
const status = ref<'idle' | 'loading' | 'error'>('idle');
const completionsEnabled = ref(false);




const complete = async () => {
    status.value = 'loading';
    streamResponse.value = '';
    try {
        const aiPromptContextLength = 300; // number of characters to consider for AI completion
        // get the 12 lines before the cursor
        const cursor = props.editor.state.selection.$from;
        const start = Math.max(0, cursor.pos - aiPromptContextLength);
        const end = Math.min(props.editor.state.doc.content.size, cursor.pos);
        const text = props.editor.state.doc.textBetween(start, end, '\n');

        console.log('Text:', text);
        if (text.length < 1) {
            streamResponse.value = 'No text to process.';
            status.value = 'idle';
            return;
        }

        if (ops.value.provider === 'ollama') {
            // abort previous request
            const ollama = new Ollama({ host: ops.value.baseUrl });
            ollama.abort();
            const responseStream = await ollama.chat({
                model: ops.value.model as string,
                messages: [
                    {
                        role: 'system',
                        content: "You are an AI assistant that completes the given text. Don't repeat the text, just complete it.",
                    },
                    {
                        role: 'user',
                        content: text,
                    },
                ],
                think: false,
                stream: true,
            });
            for await (const part of responseStream) {
                streamResponse.value += part.message.content;
                // insert the response at the cursor position
                // props.editor.commands.setCompletion(
                //     streamResponse.value,
                // );
                //
                props.editor.commands.insertContentAt(
                    props.editor.state.selection.from,
                    part.message.content,
                );
            }
            // props.editor.commands.setCompletion(
            //     // props.editor.state.selection.from,
            //     streamResponse.value,
            // );

        } else {
            // const client = new AIClient(ops.value);
            // const response = await client.chat(
            //     [
            //         {
            //             role: 'user',
            //             content: text,
            //         },
            //     ],
            // );

            // console.log('Response:', response);
            // streamResponse.value = response;
        }
    } catch (error) {
        console.error('Error asking question:', error);
        streamResponse.value = 'Error processing request.';
        status.value = 'error';
    } finally {
        status.value = 'idle';
    }
}

const acceptCompletion = async () => {
    // 
};


const addCompletionsListener = () => {
    // add listener to the editor
    const body = document.querySelector('body');
    if (body) {
        let lastKey = '';
        body.addEventListener('keydown', (event) => {
            if (event.key === ' ') {
                // remove all completions
                // check if the cursor is at the end of the line
                // const cursor = props.editor.state.selection.$from;
                // const line = props.editor.state.doc.lineAt(cursor.pos);
                // if (cursor.pos === line.from + line.length) {
                //     console.log('Cursor is at the end of the line');
                //     complete();
                // }
                
                complete();
            }
        });
    }
};



watch(
    () => completionsEnabled.value,
    (newValue) => {
        if (newValue) {
            addCompletionsListener();
        } else {

        }
    },
);

</script>


<template>
    <WorseHeaderContainer>
        <div>
            <div>
                {{ streamResponse }}
            </div>
        </div>
        <ToggleSwitch v-model="completionsEnabled" />
        {{ status }}
        <Button @click="complete">
            Complete
        </Button>
    </WorseHeaderContainer>
</template>