<script setup lang="ts">

const props = defineProps({
    compact: {
        type: Boolean,
        default: false
    }
})

const { signOut, status } = useAuth()
const { user, loadMe } = useUserHandler()

// Ensure user data is loaded
onMounted(async () => {
    await loadMe()
})

const menu = ref()

const toggle = (event: Event) => {
    menu.value.toggle(event)
}

const handleLogout = async () => {
    // Clear local storage user data
    localStorage.removeItem('user')
    await signOut({ callbackUrl: '/login' })
}

// Get user initials for avatar
const userInitials = computed(() => {
    if (!user.value?.name) return '?'
    const names = user.value.name.split(' ')
    if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return names[0].substring(0, 2).toUpperCase()
})

// Generate a consistent color based on user name
const avatarColor = computed(() => {
    if (!user.value?.name) return 'hsl(169, 48%, 50%)'
    let hash = 0
    for (let i = 0; i < user.value.name.length; i++) {
        hash = user.value.name.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = Math.abs(hash % 360)
    return `hsl(${hue}, 60%, 45%)`
})

// Dark mode toggle - uses data-theme attribute
const colorMode = useColorMode()
const isDark = computed({
    get: () => colorMode.value === 'dark',
    set: (value) => {
        const newMode = value ? 'dark' : 'light'
        colorMode.preference = newMode
        document.documentElement.setAttribute('data-theme', newMode)
        if (newMode === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }
})

// Menu items for the popup menu
const menuItems = computed(() => [
    {
        label: user.value?.name || 'User',
        disabled: true,
        class: 'font-semibold opacity-100'
    },
    {
        separator: true
    },
    {
        label: isDark.value ? 'Dark Mode' : 'Light Mode',
        icon: isDark.value ? 'pi pi-moon' : 'pi pi-sun',
        toggleSwitch: true
    },
    {
        separator: true
    },
    {
        label: 'Home / Documents',
        icon: 'pi pi-home',
        command: () => navigateTo('/')
    },
    {
        separator: true
    },
    {
        label: 'Sign out',
        icon: 'pi pi-sign-out',
        class: '!text-red-500',
        command: () => handleLogout()
    }
])
</script>

<template>
    <div class="relative">
        <Button @click="toggle" text rounded :size="compact ? 'small' : undefined" class="flex items-center gap-2 px-3"
            :class="compact ? '!py-1' : 'py-1.5'">
            <Avatar :label="userInitials" shape="circle" :size="compact ? 'small' : 'normal'"
                :style="{ backgroundColor: avatarColor, color: 'white' }" />
            <span class="text-sm font-medium max-w-[120px] truncate hidden sm:inline">
                {{ user?.name || 'User' }}
            </span>
            <i class="pi pi-chevron-down text-xs"></i>
        </Button>

        <Menu ref="menu" :model="menuItems" :popup="true" class="w-56">
            <template #item="{ item, props }">
                <template v-if="item.toggleSwitch">
                    <div class="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-surface-100 dark:hover:bg-surface-700"
                        @click="isDark = !isDark">
                        <span class="flex items-center gap-2">
                            <i :class="item.icon"></i>
                            {{ item.label }}
                        </span>
                        <ToggleSwitch v-model="isDark" @click.stop />
                    </div>
                </template>
                <template v-else-if="item.disabled">
                    <div class="px-4 py-2 font-semibold text-surface-700 dark:text-surface-200">
                        {{ item.label }}
                        <div class="text-xs font-normal text-surface-500">Signed in</div>
                    </div>
                </template>
                <template v-else>
                    <a v-bind="props.action" class="flex items-center gap-2" :class="item.class">
                        <i :class="item.icon"></i>
                        <span>{{ item.label }}</span>
                    </a>
                </template>
            </template>
        </Menu>
    </div>
</template>
