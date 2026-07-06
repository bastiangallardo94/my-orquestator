import { API_ENDPOINTS} from "@shared/constants/apiEndpoints";
import { AxiosResponse } from "axios";
import { Vendor } from "../types/vendor.types";
import apiClient from "./apiClient";

class VendorService{
    private cache: Vendor[] | null = null;

    async getVendors(): Promise<Vendor[]>{
        if(this.cache) return this.cache;

        const response = await apiClient.get<Vendor[]>(API_ENDPOINTS.VENDORS).then((res:AxiosResponse<Vendor[]>) => res.data);

        this.cache = response;
        return response;
    }

    clearCache(): void{
        this.cache = null;
    }
}

const vendorService = new VendorService();
export default vendorService
