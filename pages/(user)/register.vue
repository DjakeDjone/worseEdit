<script setup lang="ts">
import { convertDbEntryFromApi } from '~/server/model/dbEntry';
import type { FrontendUser } from '~/server/model/user';


const registerForm = reactive({
    username: '',
    token: ''
})

const error = ref('');
const { user } = useUserHandler()

const register = async () => {
    error.value = ''

    try {
        const { data, error: fetchError } = await useFetch('/api/user/register', {
            method: 'POST',
            body: registerForm
        })

        if (data.value) {
            console.log('Registration successful:', data.value);
            user.value = convertDbEntryFromApi<FrontendUser>(data.value);
            // redirect
            useRouter().push('/')
        } else {            
            error.value = 'Registration failed. Please check your credentials.' // TODO: get actual error message
        }
    } catch (e: any) {
        error.value = e.response.data.message || 'An unexpected error occurred. Please try again.'
        console.error('Registration error:', e.response)
    }
}
</script>

<template>
    <UiPage center>
        <Card class="max-w-sm mx-auto">
            <template #title>
                <h1 class="text-center text-2xl font-bold text-900">
                    Register
                </h1>
            </template>
            <template #subtitle>
                <p class="text-center text-sm text-500">
                    Please enter your username and password to create an account.
                </p>
            </template>
            <template #content>
                <Form class="flex flex-col gap-6 mt-4" @submit="register">
                    <FloatLabel>
                        <InputText id="id" v-model="registerForm.username" required fluid />
                        <label for="id">Username:</label>
                    </FloatLabel>
                    <FloatLabel>
                        <Password toggleMask type="password" id="token" v-model="registerForm.token" required fluid />
                        <label for="token" class="block text-900 font-medium mb-2">Password:</label>
                    </FloatLabel>
                    <Button type="submit" label="Register" />
                    <p v-if="error" style="color: red;">{{ error }}</p>
                </Form>
            </template>
            <template #footer>
                <p class="text-center">
                    Already have an account?
                    <NuxtLink to="/login" class="font-semibold text-blue-600 hover:text-blue-500">Login</NuxtLink>
                </p>
            </template>
        </Card>
    </UiPage>
</template>