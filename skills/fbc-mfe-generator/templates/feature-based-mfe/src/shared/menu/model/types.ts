export interface MenuItemData {
    id: string;
    label: string;
    path?: string;
    icon?: string;
    children?: MenuItemData[];
    meta?: {
        requiredRoles?: string[];
    };
}
