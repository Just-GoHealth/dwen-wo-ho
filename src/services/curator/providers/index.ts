import { listService } from "./list";
import { schoolsService } from "./schools";

export const curatorProvidersService = {
  ...listService,
  ...schoolsService,
};

export { fromProviderProfile, fromProviderSummary } from "./adapters";
