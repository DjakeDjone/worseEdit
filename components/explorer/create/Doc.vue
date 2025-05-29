<script setup lang="ts">
import type Popover from 'primevue/popover';
import { generateFileMeta } from '~/server/model/folder';


const { user } = useUserHandler();
const docHandler = useDocHelper();

const op = ref<InstanceType<typeof Popover> | null>(null);

const emit = defineEmits(['create']);

const props = defineProps<{
    currentPath?: string;
}>();


const togglePopover = (event: Event) => {
    op.value!.toggle(event);
}

const fileName = ref<string>('New File');

const createFile = async () => {
    const res = await docHandler.createDoc({
        // name: 'New File',
        name: props.currentPath +"/"+ fileName.value,
    }, user.value);
    if (res) {
        console.log('File created successfully:', res);
        if (!user.value.files) {
            user.value.files = [];
        }
        user.value.files?.push(generateFileMeta(res));
        emit('create', res);
    } else {
        console.error('Failed to create file');
    }
};

</script>


<template>
    <div>
        <Button variant="outlined" @click="togglePopover">
            <Icon name="mdi:add" />
        </Button>
        <Popover ref="op">
            <div class="flex flex-col gap-4">
                <InputText placeholder="File name" v-model="fileName" />
                <div class="flex gap-2">
                    <Button variant="text" @click="togglePopover" fluid>
                        Cancel
                    </Button>
                    <Button variant="contained" @click="createFile" fluid>
                        Create File
                    </Button>
                </div>
            </div>
        </Popover>
    </div>
</template>