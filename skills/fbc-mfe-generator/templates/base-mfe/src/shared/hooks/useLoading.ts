import React from "react";

const useLoading = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const startLoading = () => setLoading(true);
  const endLoading = () => setLoading(false);
  const [error, setError] = React.useState<string | null>(null);
  const setErrorMessage = (message: string) => setError(message);
  const clearError = () => setError(null);
  return {
    loading,
    error,
    startLoading,
    endLoading,
    setErrorMessage,
    clearError,
  };
};

export default useLoading;
