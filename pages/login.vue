<script setup lang="ts">
const { signIn, status } = useAuth()

definePageMeta({
    auth: {
        unauthenticatedOnly: true,
        navigateAuthenticatedTo: '/',
    }
})

// Watch auth status and redirect when authenticated
watch(status, (newStatus) => {
    if (newStatus === 'authenticated') {
        navigateTo('/')
    }
})

const handleGitHubSignIn = async () => {
    await signIn('github', { callbackUrl: '/' })
}
</script>

<template>
    <div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div class="w-full max-w-md space-y-8">
            <div>
                <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Sign in to your account
                </h2>
            </div>
            <div class="mt-8 space-y-6">
                <Button @click="handleGitHubSignIn" severity="contrast" class="w-full justify-center">
                    <Icon name="uil:github" class="mr-2 h-5 w-5" aria-hidden="true" />
                    Sign in with GitHub
                </Button>
            </div>
        </div>
    </div>
</template>
