import { definePreset } from "@primevue/themes";
import Aura from '@primevue/themes/aura';

const MainTheme = definePreset(Aura, {
    semantic: {
        text: {
            50: '#f3f3f2',
            100: '#e6e6e5',
            200: '#cececa',
            300: '#b5b5b0',
            400: '#9c9c96',
            500: '#83837c',
            600: '#696963',
            700: '#4f4f4a',
            800: '#353531',
            900: '#1a1a19',
            950: '#0d0d0c',
        },
        background: {
            50: '#f3f1f1',
            100: '#e8e3e3',
            200: '#d0c8c8',
            300: '#b9acac',
            400: '#a19191',
            500: '#8a7575',
            600: '#6e5e5e',
            700: '#534646',
            800: '#372f2f',
            900: '#1c1717',
            950: '#0e0c0c',
        },
        primary: {
            50: '#f5f2f0',
            100: '#eae5e1',
            200: '#d6ccc2',
            300: '#c1b2a4',
            400: '#ac9886',
            500: '#987f67',
            600: '#796553',
            700: '#5b4c3e',
            800: '#3d3329',
            900: '#1e1915',
            950: '#0f0d0a',
        },
        secondary: {
            50: '#f6f2ef',
            100: '#ece5df',
            200: '#daccbe',
            300: '#c7b29e',
            400: '#b5987d',
            500: '#a27e5d',
            600: '#82654a',
            700: '#614c38',
            800: '#413325',
            900: '#201913',
            950: '#100d09',
        },
        accent: {
            50: '#f7f2ee',
            100: '#eee5dd',
            200: '#ddcbbb',
            300: '#cdb198',
            400: '#bc9776',
            500: '#ab7d54',
            600: '#896443',
            700: '#674b32',
            800: '#443222',
            900: '#221911',
            950: '#110c08',
        },
    }
});

export default {
    preset: MainTheme,
    options: {
        darkModeSelector: false,
    }
};
