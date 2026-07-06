import React from 'react';
import {countryService} from "@services/countryService";

const useCountry = () => {

  const getCountryByDestination = async (bu: string) => {

    try {
      const response = await countryService.getDestinationCountries(bu);
      return response;
    } catch (e){
      console.error('Error fetching getDestinationCountries:', e);
      throw e;
    }
  }


  return {
    getCountryByDestination
  }
};

export default useCountry;
