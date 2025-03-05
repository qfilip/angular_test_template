export type DialogOptions = {
    header: string;
    message: string;
    type: 'info' | 'warning';
    buttons: { 
        label: string;
        action: () => void
    }[];
}