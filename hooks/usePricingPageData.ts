import { useQuery } from '@tanstack/react-query';
import pricingServices from '../services/api/methods/pricingServices';
import couponService from '../services/api/methods/couponService';
import customerProfileServices from '../services/api/methods/profileService';
import kycService from '../services/api/methods/kycService';

export const usePricingPageData = () => {
  return useQuery({
    queryKey: ['pricingPageData'],
    queryFn: async () => {
      const [plansResp, couponsResp, profileResp, kycResp] = await Promise.all([
        pricingServices.getAllPricingPlans(),
        couponService.getCoupons().catch(() => ({ success: false, data: [] })),
        customerProfileServices.getProfile().catch(() => null),
        kycService.getKycFullDetails().catch(() => null)
      ]);

      return {
        plansResp,
        couponsResp,
        profileResp,
        kycResp
      };
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
