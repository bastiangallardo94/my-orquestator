export interface UserInformation {
    email: string;
    firstName: string;
    lastName: string;
    origin: string;
    businessUnitList: BusinessUnitItem[];
    tenantList: TenantItem[]
}

export interface BusinessUnitItem {
    id: number;
    name: string;
    code: string;
    countryList: CountryItem[]
}

export interface CountryItem {
    name: string;
    code: string;
}

export interface TenantItem {
    businessUnit: string;
    countryCode: string;
}