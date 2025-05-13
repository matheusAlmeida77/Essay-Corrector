import { gradeService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export function useGrades() {
  return useQuery({
    queryKey: ["grades"],
    queryFn: async () => {
      const response = await gradeService.getAll();
      return response.entries;
    },
    staleTime: 30000,
    refetchOnMount: true,
    retry: 2,
  });
}
