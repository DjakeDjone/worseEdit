import { useToast } from 'primevue/usetoast'

export default defineNuxtPlugin((nuxtApp) => {
    const toast = useToast()

    // Handle Vue errors
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
        console.error('Vue error:', error, info)
        
        toast.add({
            severity: 'error',
            summary: 'Application Error',
            detail: error instanceof Error ? error.message : 'An unexpected error occurred',
            life: 5000
        })
    }

    // Handle unhandled promise rejections
    if (process.client) {
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason)
            
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: event.reason?.message || 'An unexpected error occurred',
                life: 5000
            })
        })
    }

    // Provide a global error handler function
    return {
        provide: {
            handleError: (error: Error | string, summary = 'Error') => {
                const message = typeof error === 'string' ? error : error.message
                
                toast.add({
                    severity: 'error',
                    summary,
                    detail: message,
                    life: 5000
                })
            },
            showToast: (severity: 'success' | 'info' | 'warn' | 'error', summary: string, detail?: string) => {
                toast.add({
                    severity,
                    summary,
                    detail,
                    life: 3000
                })
            }
        }
    }
})
