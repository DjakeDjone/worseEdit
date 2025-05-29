export default defineNuxtPlugin((nuxtApp) => {
    // const { session } = useUserSession()

    const api = $fetch.create({
        baseURL: useRuntimeConfig().public.apiBase?'/api':useRuntimeConfig().public.apiBase as string,
        onRequest({ request, options, error }) {
            options.credentials = 'include'
        },
        //  async onResponse({ response }) {
        //     // Transform dates
        //     if (typeof response._data === 'string') {
        //         try {
        //             response._data = JSON.parse(response._data, (key, value) => {
        //                 if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?Z$/.test(value)) {
        //                     return new Date(value);
        //                 }
        //                 return value;
        //             });
        //         } catch (e) {
        //             // Ignore JSON parsing errors
        //         }
        //     }
        // },
        async onResponseError({ response }) {
            if (response.status === 401) {
                await nuxtApp.runWithContext(() => {
                    useToast().add({
                        summary: 'Unauthorized',
                        detail: 'You need to login to access this page',
                        severity: 'error',
                        life: 5000
                    })
                    navigateTo('/login', { replace: true })
                })
            }
            // TODO: handle errors
        }
    })

    // Expose to useNuxtApp().$api
    return {
        provide: {
            api
        }
    }
})
