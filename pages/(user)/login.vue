<script setup lang="ts">
import { convertDbEntryFromApi } from '~/server/model/dbEntry'
import { type FrontendUser, type User } from '~/server/model/user'


const loginForm = reactive({
    username: '',
    token: ''
})

const error = ref('')
const { user } = useUserHandler()


const login = async () => {
    error.value = ''

    try {
        const { data } = await useFetch('/api/user/login', {
            method: 'POST',
            body: loginForm
        })

        if (data.value) {
            console.log('Login successful:', data.value)
            user.value = convertDbEntryFromApi<FrontendUser>(data.value);
            // redirect
            useRouter().push('/')
        } else {
            error.value = 'Login failed. Please check your credentials.'
        }
    } catch (e: any) {
        // error.value = 'An unexpected error occurred. Please try again.'
        error.value = e.response.data.message
        console.error('Login error:', e)
    }
}
</script>

<template>
    <UiPage center>
        <Card class="max-w-sm mx-auto">
            <template #title>
                <h1 class="text-center text-2xl font-bold text-900">
                    Login
                </h1>
            </template>
            <template #subtitle>
                Please enter your user ID and token to log in.
            </template>
            <template #content>
                <Form class="flex flex-col gap-6 mt-4" @submit="login">
                    <FloatLabel>
                        <label for="id">Username:</label>
                        <InputText id="id" v-model="loginForm.username" required fluid />
                    </FloatLabel>
                    <FloatLabel>
                        <label for="token" class="block text-900 font-medium mb-2">Password:</label>
                        <InputText id="token" v-model="loginForm.token" required fluid />
                    </FloatLabel>
                    <Button type="submit" label="Login" />
                    <p v-if="error" style="color: red;">{{ error }}</p>
                </Form>
            </template>
            <template #footer>
                <p class="text-center">
                    Don't have an account?
                    <NuxtLink to="/register" class="font-semibold text-blue-600 hover:text-blue-500">Register</NuxtLink>
                </p>
            </template>
        </Card>
    </UiPage>
</template>