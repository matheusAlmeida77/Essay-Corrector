import { essayService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export function useEssays() {
  return useQuery({
    queryKey: ["essays"],
    queryFn: async () => {
      const response = await essayService.getAll();
      return response.entries;
    },
    staleTime: 30000,
    refetchOnMount: true,
    retry: 2,
  });
}
