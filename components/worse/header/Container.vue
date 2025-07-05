<template>
    <div class="w-full h-16 p-2  border-b border-gray-300">
        <!-- bg-gray-100 -->
        <div class="flex items-center gap-2">
            <slot></slot>
        </div>
        <div>
            <slot name="mobile-actions"></slot>
        </div>
    </div>
</template>

<style>
/* responsiveness */

/* .no-mobile */

@media (max-width: 768px) {
    .no-mobile {
        display: none;
    }
}

</style>