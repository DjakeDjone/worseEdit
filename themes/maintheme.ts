import { definePreset } from "@primevue/themes";
import Aura from '@primevue/themes/aura';

const MainTheme = definePreset(Aura, {
    semantic: {
        text: {
            50: '#eff6f5',
            100: '#deedeb',
            200: '#bddbd8',
            300: '#9cc9c4',
            400: '#7bb7b1',
            500: '#5ba49d',
            600: '#48847e',
            700: '#36635e',
            800: '#24423f',
            900: '#12211f',
            950: '#091010',
        },
        background: {
            50: '#eff5f5',
            100: '#dfecec',
            200: '#bfd9d9',
            300: '#9fc6c6',
            400: '#80b3b3',
            500: '#609f9f',
            600: '#4d7f80',
            700: '#396060',
            800: '#264040',
            900: '#132020',
            950: '#0a1010',
        },
        primary: {
            50: '#eef6f5',
            100: '#deedeb',
            200: '#bddbd8',
            300: '#9cc9c4',
            400: '#7ab8b0',
            500: '#59a69d',
            600: '#47857d',
            700: '#36635e',
            800: '#24423f',
            900: '#12211f',
            950: '#091110',
        },
        secondary: {
            50: '#f3eef6',
            100: '#e6deed',
            200: '#cdbddb',
            300: '#b49cc9',
            400: '#9b7ab8',
            500: '#8259a6',
            600: '#684785',
            700: '#4e3663',
            800: '#342442',
            900: '#1a1221',
            950: '#0d0911',
        },
        accent: {
            50: '#f6eef5',
            100: '#eddeec',
            200: '#dbbdd9',
            300: '#c99cc6',
            400: '#b87ab3',
            500: '#a6599f',
            600: '#854780',
            700: '#633660',
            800: '#422440',
            900: '#211220',
            950: '#110910',
        },
    }
});

export default {
    preset: MainTheme,
    options: {
        darkModeSelector: false,
    }
};
