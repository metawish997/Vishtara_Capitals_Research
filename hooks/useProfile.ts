import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import customerProfileServices from '../services/api/methods/profileService';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response: any = await customerProfileServices.getAllProfiles();
      return response?.data || response;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useInvalidateProfile = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['profile'] });
};
