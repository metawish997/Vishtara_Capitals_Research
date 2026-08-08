import { useQuery } from '@tanstack/react-query';
import pricingServices from '../services/api/methods/pricingServices';

export const usePricingPlans = () => {
  return useQuery({
    queryKey: ['pricingPlans'],
    queryFn: async () => {
      const response: any = await pricingServices.getAllPricingPlans();
      return response?.data || response;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours cache
  });
};
