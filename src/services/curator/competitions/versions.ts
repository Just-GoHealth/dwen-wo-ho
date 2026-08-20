import { api } from "@/lib/api";
import { DYNAMIC_ENDPOINTS } from "@/lib/constants/infra/endpoints";
import {
  SetVersionPeriodRequest,
  TagSchoolsIntoVersionRequest,
  Team,
  RegisterTeamRequest,
  Version,
  ImportFixturesRequest,
  ImportFixturesResponse,
} from "@/lib/types/api/competitions";
import {
  extractArrayData,
  requireSuccessData,
} from "@/lib/utils/shared/api-result";

export const versionsService = {
  setPeriod: async (
    code: string,
    data: SetVersionPeriodRequest,
  ): Promise<Version> => {
    const result = await api(DYNAMIC_ENDPOINTS.VERSIONS.SET_PERIOD(code), {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return requireSuccessData<Version>(result, "Failed to set version period");
  },

  getTeams: async (code: string): Promise<Team[]> => {
    const result = await api(DYNAMIC_ENDPOINTS.VERSIONS.TEAMS(code));
    return extractArrayData<Team>(result);
  },

  registerTeam: async (
    code: string,
    data: RegisterTeamRequest,
  ): Promise<Team> => {
    const result = await api(DYNAMIC_ENDPOINTS.VERSIONS.REGISTER_TEAM(code), {
      method: "POST",
      body: JSON.stringify(data),
    });
    return requireSuccessData<Team>(result, "Failed to register team");
  },

  tagSchools: async (
    code: string,
    data: TagSchoolsIntoVersionRequest,
  ): Promise<Team[]> => {
    const result = await api(DYNAMIC_ENDPOINTS.VERSIONS.TAG_TEAMS(code), {
      method: "POST",
      body: JSON.stringify(data),
    });
    return extractArrayData<Team>(result);
  },

  untagSchool: async (
    code: string,
    campusId: string | number,
  ): Promise<void> => {
    await api(DYNAMIC_ENDPOINTS.VERSIONS.UNTAG_TEAM(code, campusId), {
      method: "DELETE",
    });
  },

  importFixtures: async (
    code: string,
    data: ImportFixturesRequest,
  ): Promise<ImportFixturesResponse> => {
    const result = await api(DYNAMIC_ENDPOINTS.VERSIONS.IMPORT_FIXTURES(code), {
      method: "POST",
      body: JSON.stringify(data),
    });
    return requireSuccessData<ImportFixturesResponse>(
      result,
      "Failed to import fixtures",
    );
  },
};
