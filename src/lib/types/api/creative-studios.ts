// Inputs for the Creative Studios create flows. The services turn them into the
// v2 requests in src/lib/v2/curator/* (JSON create, then a separate image upload).

export interface CreateCampusInput {
  fullName: string;
  nicknames: string[];
  motto?: string;
  /** The campus-type label picked in the form (GET /campus-types `label`). */
  type: string;
  /** The location name picked in the form (GET /locations `name`). */
  location: string;
  logo?: File | null;
  bannerPhoto?: File | null;
}

export interface CreateProgrammeInput {
  fullName: string;
  nicknames: string[];
  bio?: string;
  durationFromYear: number;
  durationToYear: number;
  coverPhoto?: File | null;
}

export interface CreateTagInput {
  mainTitle: string;
  tags: string[];
}

/** A provider record created in Studios (approved from the start, no account). */
export interface CreateStudioProviderInput {
  fullName: string;
  nicknames: string[];
  bio?: string;
  clinical: boolean;
  photo?: File | null;
}

// Kept for src/services/shared/specialties.ts (v1, provider-agent owned).
export interface CreateSpecialtyInput {
  name: string;
  nicknames: string[];
  bio?: string;
  clinical: boolean;
  icon?: File | null;
}

export interface SpecialtyCreateResponse {
  specialty: string;
  slug: string;
  icon?: string;
  clinical: boolean;
  nicknames?: string[];
  bio?: string;
}
