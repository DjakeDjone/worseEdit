<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
    error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
    <main>
        <div v-if="error?.statusCode === 404"
            class="flex justify-center items-center min-h-screen w-full p-4 flex-col text-center">
            <h1 class="text-4xl font-bold mb-3">
                Seite nicht gefunden!
            </h1>
            <h2 class="max-w-2xl">
                Die angeforderte Seite konnte nicht gefunden werden. Bitte überprüfen Sie die URL oder kehren Sie zur
                Startseite zurück.
            </h2>
            <button @click="handleError" class="mt-4 bg-primary-500 text-white px-4 py-2 rounded-md">
                Zurück zur Startseite
            </button>
        </div>
        <div v-else class="flex justify-center items-center min-h-screen w-full p-4 flex-col text-center">
            <h1 class="text-4xl font-bold mb-3">
                Ein Fehler ist aufgetreten!
            </h1>
            <h2 class="max-w-2xl">
                Die Website ist momentan nicht erreichbar. Bitte versuchen Sie es später erneut oder wenden Sie sich an
                die Musikschule.
            </h2>
        </div>
        <section class="absolute bottom-0 left-0 w-full p-4 bg-red-500 text-white text-center">
            <h3>
                Fehlermeldung: <span>
                    {{ error?.statusCode }}
                </span>
            </h3>
            <pre>{{ error?.message }}</pre>
        </section>
    </main>
</template>
