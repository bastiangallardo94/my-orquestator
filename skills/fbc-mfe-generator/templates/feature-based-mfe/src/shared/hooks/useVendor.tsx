import React from 'react';
import vendorService from "@services/vendorService";

const useVendor = () => {

  const getVendor = async () => {

    try {

      const response = vendorService.getVendors();

      return response;

    } catch (e){
      console.error('Error fetching getVendor:', e);
      throw e;
    }
  }

  return {
    getVendor
  }
};

export default useVendor;
