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

const scale = defineModel('scale', {
    type: Number,
    default: 1,
})

</script>


<template>
    <div class="mt-4 px-4 py-2 border-t border-gray-300 flex items-center justify-between">
        <span class="w-fit">
            {{ editor.storage.characterCount.words() }} w<span class="hidden sm:inline-block">ords</span><span class="sm:hidden">.</span>
            <span class="hidden md:inline-block">, {{ editor.storage.characterCount.characters() }} chars</span>
        </span>
        <div class="flex items-center gap-2">
            <Button variant="text" @click="scale -= 0.1" class="cursor-pointer">
                -
            </Button>
            <Slider v-model="scale" :step=".01" :min="0.3" :max="3" class="w-42 max-w-full hidden sm:block" />
            <Button variant="text" @click="scale += 0.1" class="cursor-pointer">
                +
            </Button>
            <span @click="scale=1" class="cursor-pointer w-12">
                {{ scale * 100 | 0 }}%
            </span>
        </div>
    </div>
</template>