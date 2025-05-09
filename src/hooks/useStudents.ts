import { studentService } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: studentService.getAll,
    staleTime: 30000,
    refetchOnMount: true,
    retry: 2,
  });
}
