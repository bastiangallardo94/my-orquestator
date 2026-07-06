export const keepOnlyNumbers = (text: string): string => {
    if (!text) {
        return '';
    }
    return text.replace(/[^0-9]/g, '');
};
