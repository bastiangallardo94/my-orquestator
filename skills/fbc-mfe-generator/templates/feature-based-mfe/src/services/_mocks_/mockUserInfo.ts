import { UserInformation } from "../../types/userInformation";

export const mockUserInfo: UserInformation = {
    email: "",
    firstName: "",
    lastName: "",
    origin: "",
    businessUnitList: [
        {
            id: 0,
            name: "SODIMAC",
            code: "SOD",
            countryList: []
        },
        {
            id: 1,
            name: "FALABELLA",
            code: "FAL",
            countryList: []
        },
    ],
    tenantList: []
}