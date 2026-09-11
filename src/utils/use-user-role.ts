import { useQuery } from '@tanstack/react-query';
import type { UserRole } from '@/types';
import { supabase } from './supabase';

export default function useUserRole() {
  return useQuery<UserRole>({
    queryKey: ['user-role'],
    queryFn: async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(userError?.message || 'User not found');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data.role;
    },
  });
}
