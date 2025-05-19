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
});

const color = ref('#000000');
const op = ref();

const toggle = (event) => {
    op.value.toggle(event);
}

const setHighlight = () => {
    props.editor.chain().focus().toggleHighlight({ color: "#" + color.value }).run();
};

const computeColor = (row: number, col: number) => {
    row -= 1;
    col -= 1;
    const r = Math.floor(row * 255 / 7);
    const g = Math.floor(col * 255 / 7);
    const b = Math.floor((row + col) * 255 / 14);
    return `${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const colorHistory = ref([
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF', '#000000',
    '#FFA500', '#800080', '#008080', '#FFC0CB', '#808080', '#A52A2A', '#D2691E', '#8B4513',
]);

</script>

<template>
    <div>
        <Button variant="link" @click="toggle">
            <Icon name="mdi:highlighter" />
        </Button>
        <Popover ref="op">
            <div class="flex flex-col items-center gap-2">
                <Button variant="link" @click="props.editor.chain().focus().unsetHighlight().run();">
                    No color
                    <Icon name="mdi:format-color-marker-cancel" />
                </Button>
                <div id="defaultColors" class="flex flex-col gap-1">
                    <div class="flex flex-row gap-1" v-for="(row, index) in 8" :key="index">
                        <span v-for="(col, index) in 8" :key="index" class="h-4 w-4 rounded-full cursor-pointer" :style="{
                            backgroundColor: `#${computeColor(row, col)}`
                        }" @click="color = computeColor(row, col); setHighlight()">
                        </span>
                    </div>
                </div>
                <ColorPicker v-model="color" @change="setHighlight()"
                    :value="editor.getAttributes('textStyle').backgroundColor">
                </ColorPicker>
            </div>
        </Popover>
    </div>
</template>