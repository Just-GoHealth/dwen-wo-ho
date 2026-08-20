import { api } from "@/lib/api";
import { DYNAMIC_ENDPOINTS } from "@/lib/constants/infra/endpoints";
import {
  AddFixtureRequest,
  Fixture,
  RecordFixtureOutcomeRequest,
} from "@/lib/types/api/competitions";
import {
  extractArrayData,
  requireSuccessData,
} from "@/lib/utils/shared/api-result";

export const fixturesService = {
  getFixtures: async (teamId: string | number): Promise<Fixture[]> => {
    const result = await api(DYNAMIC_ENDPOINTS.TEAMS.FIXTURES(teamId));
    return extractArrayData<Fixture>(result);
  },

  addFixture: async (
    teamId: string | number,
    data: AddFixtureRequest,
  ): Promise<Fixture> => {
    const result = await api(DYNAMIC_ENDPOINTS.TEAMS.ADD_FIXTURE(teamId), {
      method: "POST",
      body: JSON.stringify(data),
    });
    return requireSuccessData<Fixture>(result, "Failed to add fixture");
  },

  updateFixture: async (
    fixtureId: string | number,
    data: AddFixtureRequest,
  ): Promise<Fixture> => {
    const result = await api(DYNAMIC_ENDPOINTS.FIXTURES.UPDATE(fixtureId), {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return requireSuccessData<Fixture>(result, "Failed to update fixture");
  },

  deleteFixture: async (fixtureId: string | number): Promise<void> => {
    await api(DYNAMIC_ENDPOINTS.FIXTURES.DELETE(fixtureId), {
      method: "DELETE",
    });
  },

  recordOutcome: async (
    fixtureId: string | number,
    data: RecordFixtureOutcomeRequest,
  ): Promise<Fixture> => {
    const result = await api(
      DYNAMIC_ENDPOINTS.FIXTURES.RECORD_OUTCOME(fixtureId),
      { method: "PUT", body: JSON.stringify(data) },
    );
    return requireSuccessData<Fixture>(result, "Failed to record outcome");
  },
};
