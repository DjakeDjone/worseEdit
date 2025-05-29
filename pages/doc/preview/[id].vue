<script setup lang="ts">

const id = useRoute().params.id as string;
const { data: html } = useFetch("/api/editor/" + id);

</script>

<template>
    {{ html }}
</template>