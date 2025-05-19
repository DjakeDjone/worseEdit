<template>
    <div class="w-full h-16 p-2 bg-gray-100 border-b border-gray-300">
        <div class="hidden md:flex items-center justify-between">
            <slot></slot>
        </div>
        <div>
            <slot name="mobile-actions"></slot>
        </div>
    </div>
</template>