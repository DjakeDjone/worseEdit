<template>
    <NuxtLink to="/" class="w-fit">
        <h1 class="flex gap-3 items-center !text-2xl font-bold hover:scale-105 active:scale-95 transition-transform w-fit h-fit">
            <img src="/assets/images/WorstLogo.png" alt="Worse Editor Logo" class="inline-block h-8 mr-2 !m-0">
            <slot></slot>
        </h1>
    </NuxtLink>
</template>