import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/service/service';

export function useUser() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => await api.auth.getUser(),
    staleTime: Infinity
  });
}

export function useLogin() {
  const queryclient = useQueryClient(); 
  return useMutation({
  mutationFn: async ({email, password}: {email: string , password: string}) =>{
    const user = await api.auth.logIn(email, password);
    return user; 
  }, 
  onSuccess: (user) => { 
    queryclient.invalidateQueries({
      queryKey: ['users']
    })
  }
  })
}