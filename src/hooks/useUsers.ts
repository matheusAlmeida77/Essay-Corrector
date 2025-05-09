import { userService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    staleTime: 30000,
    refetchOnMount: true,
    retry: 2,
  });
}
