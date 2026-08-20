import { api } from "@/lib/api";
import { DYNAMIC_ENDPOINTS } from "@/lib/constants/infra/endpoints";
import { Team } from "@/lib/types/api/competitions";
import { requireSuccessData } from "@/lib/utils/shared/api-result";

export const teamsService = {
  getTeam: async (teamId: string | number): Promise<Team> => {
    const result = await api(DYNAMIC_ENDPOINTS.TEAMS.GET(teamId));
    return requireSuccessData<Team>(result, "Failed to fetch team");
  },

  updateTeam: async (
    teamId: string | number,
    data: Partial<Team>,
  ): Promise<Team> => {
    const result = await api(DYNAMIC_ENDPOINTS.TEAMS.UPDATE(teamId), {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return requireSuccessData<Team>(result, "Failed to update team");
  },
};
