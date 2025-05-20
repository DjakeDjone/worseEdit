<script setup lang="ts">

const el = ref<HTMLElement | null>(null);

onMounted(() => {

});

const createEventListenerOnEl = () => {
    console.log('createEventListenerOnEl');
    if (el.value) {
        el.value.addEventListener('click', () => {
            console.log('clicked');
        });
    }
};

</script>

<template>
    <div>
        <button @click="createEventListenerOnEl">
            Create Event Listener
        </button>
        <div ref="el">
            test
        </div>
    </div>
</template>