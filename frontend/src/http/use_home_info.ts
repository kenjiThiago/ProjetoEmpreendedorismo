import { useQuery } from "@tanstack/react-query"
import type { GetHomeInfo } from "./types/get_home_info"

export function useHomeInfo() {
  return useQuery({
    queryKey: ["get_home_info"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8000/")
      const result: GetHomeInfo = await response.json()

      return result
    },
  })
}
