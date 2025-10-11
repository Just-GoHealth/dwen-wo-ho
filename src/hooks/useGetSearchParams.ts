import { useSearchParams } from "next/navigation";

const useGetSearchParams = (query: string): string => {
  const searchParams = useSearchParams();
  return searchParams.get(query) as string
};

export default useGetSearchParams;