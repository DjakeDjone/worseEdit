<script setup lang="ts">
import { useConfirm } from "primevue/useconfirm";

definePageMeta({
    middleware: 'sidebase-auth'
})

const { user, loadMe, logout } = useUserHandler()
const { signOut } = useAuth()
const confirm = useConfirm()

// Ensure user data is loaded
onMounted(async () => {
    await loadMe()
})

// Download all files as ZIP
const isDownloading = ref(false)
const downloadAllFiles = async () => {
    isDownloading.value = true
    try {
        const response = await useNuxtApp().$api('/api/user/export', {
            method: 'GET',
            credentials: 'include',
            responseType: 'blob'
        })

        // Create download link
        const blob = new Blob([response as BlobPart], { type: 'application/zip' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `worse-documents-${new Date().toISOString().split('T')[0]}.zip`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    } catch (error) {
        console.error('Failed to download files:', error)
    } finally {
        isDownloading.value = false
    }
}

// Delete account with confirmation
const isDeleting = ref(false)
const confirmDeleteAccount = () => {
    confirm.require({
        message: 'This will permanently delete your account and all your documents. This action cannot be undone.',
        header: 'Delete Account?',
        icon: 'pi pi-exclamation-triangle',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete Account',
            severity: 'danger'
        },
        accept: async () => {
            isDeleting.value = true
            try {
                await useNuxtApp().$api('/api/user/delete', {
                    method: 'DELETE',
                    credentials: 'include'
                })

                // Clear local state and redirect
                localStorage.removeItem('user')
                logout()
                await signOut({ callbackUrl: '/login' })
            } catch (error) {
                console.error('Failed to delete account:', error)
            } finally {
                isDeleting.value = false
            }
        }
    })
}

// Get formatted date
const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
</script>

<template>
    <main>
        <!-- Header -->
        <header class="sticky top-0 z-50 mb-8 px-4 py-3 backdrop-blur-xl border-b">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <NuxtLink to="/">
                        <Icon name="mdi:arrow-left" size="24" />
                    </NuxtLink>
                    <h1 class="text-xl font-semibold">Account Settings</h1>
                </div>
                <WorseHeaderUserMenu compact />
            </div>
        </header>

        <div class="px-4 space-y-6">
            <!-- User Info Card -->
            <Card class="!bg-surface-50 dark:!bg-surface-800/50 max-w-2xl">
                <template #title>
                    <div class="flex items-center gap-3">
                        <i class="pi pi-user text-xl text-primary"></i>
                        <span>Account Information</span>
                    </div>
                </template>
                <template #content>
                    <div class="space-y-3">
                        <div
                            class="flex items-center justify-between py-2 border-b border-surface-200 dark:border-surface-700">
                            <span class="text-surface-500 dark:text-surface-400">Name</span>
                            <span class="font-medium">{{ user?.name || 'Unknown' }}</span>
                        </div>
                        <div
                            class="flex items-center justify-between py-2 border-b border-surface-200 dark:border-surface-700">
                            <span class="text-surface-500 dark:text-surface-400">Documents</span>
                            <span class="font-medium">{{ user?.files?.length || 0 }} files</span>
                        </div>
                        <div class="flex items-center justify-between py-2">
                            <span class="text-surface-500 dark:text-surface-400">Member since</span>
                            <span class="font-medium">{{ user?.createdAt ? formatDate(user.createdAt) : 'Unknown'
                                }}</span>
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Data Export Card -->
            <Card class="!bg-surface-50 dark:!bg-surface-800/50 max-w-2xl">
                <template #title>
                    <div class="flex items-center gap-3">
                        <i class="pi pi-download text-xl text-primary"></i>
                        <span>Export Data</span>
                    </div>
                </template>
                <template #content>
                    <p class="text-surface-600 dark:text-surface-400 mb-4">
                        Download all your documents as a ZIP archive. Each document will be saved as an HTML file.
                    </p>
                    <Button @click="downloadAllFiles" :loading="isDownloading" :disabled="!user?.files?.length"
                        icon="pi pi-download" label="Download All Files" severity="secondary" />
                </template>
            </Card>

            <!-- Danger Zone -->
            <Card class="!border-red-500/30 !bg-red-50 dark:!bg-red-900/10 max-w-2xl">
                <template #title>
                    <div class="flex items-center gap-3">
                        <i class="pi pi-exclamation-triangle text-xl text-red-500"></i>
                        <span class="text-red-600 dark:text-red-400">Danger Zone</span>
                    </div>
                </template>
                <template #content>
                    <p class="text-surface-600 dark:text-surface-400 mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button @click="confirmDeleteAccount" :loading="isDeleting" icon="pi pi-trash"
                        label="Delete Account" severity="danger" />
                </template>
            </Card>
        </div>

        <!-- Confirmation Dialog -->
        <ConfirmDialog />
    </main>
</template>
