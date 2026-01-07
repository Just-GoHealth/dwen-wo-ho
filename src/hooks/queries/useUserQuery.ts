import { api } from "@/lib/api";
import { ENDPOINTS } from "@/constants/endpoints";
import { useQuery } from "@tanstack/react-query";

const useUserQuery = (options?: { refetchInterval?: number; enabled?: boolean }) => {
    const getProfileQuery = useQuery({
        queryKey: ["auth", "profile"],
        queryFn: () => getProfile(),
        ...options,
    });

    async function getProfile() {
        const response = await api(ENDPOINTS.profile, { method: "GET" });
        return response.data;
    }

    return {
        getProfileQuery,
    };
};

export default useUserQuery;
