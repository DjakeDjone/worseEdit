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

const setTransparentSelection = (transparent: boolean) => {
    // add class 'transparent-selection' to the body
    if (transparent) {
        document.body.classList.add('transparent-selection');
    } else {
        document.body.classList.remove('transparent-selection');
    }
}

</script>

<template>
    <WorseHeaderContainer>

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

        <Dropdown class="no-mobile" :class="{ 'p-button-active': editor.isActive('heading', { level: 1 }) }" :options="[
            { label: 'H1', command: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
            { label: 'H2', command: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
            { label: 'H3', command: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
            { label: 'H4', command: () => editor.chain().focus().toggleHeading({ level: 4 }).run() },
            { label: 'text', command: () => editor.chain().focus().setParagraph().run() },
        ]" placeholder="Heading" optionLabel="label" @change="(e) => {
            e.value.command()
        }" />

        <!-- color -->

        <input type="color" @input="editor.chain().focus().setColor(($event.target! as any).value).run()"
            :value="editor.getAttributes('textStyle').color" />
        <!-- <ColorPicker @input="editor.chain().focus().setColor($event.target.value).run()"
          :value="editor.getAttributes('textStyle').color"/> -->

        <!-- highlight -->
        <WorseHeaderHomeHighlight :editor="editor" />

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
            <Button severity="secondary" @click="editor.chain().focus().toggleUnderline().run()"
                :disabled="!editor.can().chain().focus().toggleUnderline().run()" v-tooltip.bottom="'Underline'"
                :class="{ 'p-button-active': editor.isActive('underline') }">
                <Icon name="mdi:format-underline" />
            </Button>
        </div>

        <Dropdown class="no-mobile"
            :class="{ 'p-button-active': editor.isActive('bulletList') || editor.isActive('orderedList') || editor.isActive('taskList') }"
            :options="[
                { label: 'Bullet List', command: () => editor.chain().focus().toggleBulletList().run() },
                { label: 'Ordered List', command: () => editor.chain().focus().toggleOrderedList().run() },
                { label: 'Task List', command: () => editor.chain().focus().toggleTaskList().run() },
            ]" placeholder="List Type" optionLabel="label" @change="(e) => {
                e.value.command()
            }" />
    </WorseHeaderContainer>
</template>

<style>
.transparent-selection ::-moz-selection {
    /* Code for Firefox */
    background: transparent;
}

.transparent-selection ::selection {
    background: transparent;
}
</style>