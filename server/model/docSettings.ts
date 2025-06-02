export type DocSettings = Partial<{
    margins: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
    fontSize: number; // in px
    fontFamily: string; // e.g. 'Arial', 'Times New Roman'
    lineHeight: number; // in px
    pageWidth: number; // in px
    pageHeight: number; // in px
    pageBackgroundColor: string; // e.g. '#ffffff' for white
    pageColor: string; // e.g. '#000000' for black
    pageOrientation: 'portrait' | 'landscape'; // orientation of the page
    showLineNumbers: boolean; // whether to show line numbers
    showPageNumbers: boolean; // whether to show page numbers
    showHeader: boolean; // whether to show header
    showFooter: boolean; // whether to show footer
    headerText: string; // text to show in the header
    footerText: string; // text to show in the footer
}>

export type DefaultOption<T> = {
    name: string;
    description: string;
    defaultValue: T;
}

export const marginOptions: DefaultOption<DocSettings['margins']>[] = [
    {
        name: 'Normal',
        description: 'Standard margins for most documents',
        defaultValue: {
            top: 1.0,
            bottom: 1.0,
            left: 1,
            right: 1
        }
    },
    {
        name: 'Narrow',
        description: 'Reduced margins for more content space',
        defaultValue: {
            top: 0.5,
            bottom: 0.5,
            left: 0.5,
            right: 0.5
        }
    },
    {
        name: 'Wide',
        description: 'Increased margins for a cleaner look',
        defaultValue: {
            top: 1.5,
            bottom: 1.5,
            left: 1.5,
            right: 1.5
        }
    },
    {
        name: 'Custom',
        description: 'Custom margins defined by the user',
        defaultValue: {
            top: 1.0,
            bottom: 1.0,
            left: 1,
            right: 1
        }
    }
]