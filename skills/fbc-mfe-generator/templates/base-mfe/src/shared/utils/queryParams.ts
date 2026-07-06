export const buildQueryParams = (params: Record<string, any>) => {
    const cleaned: Record<string, any> = {};
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value != null && value !== '') {
            cleaned[key] = value
        }
    });
    return cleaned;
}

