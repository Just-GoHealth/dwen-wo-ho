export type CampusApiType =
  "HIGH_SCHOOL" | "JUNIOR_HIGH" | "SENIOR_HIGH" | "COLLEGE" | "UNIVERSITY";

export interface CreateCampusInput {
  fullName: string;
  nicknames: string[];
  motto?: string;
  type: string;
  location: string;
  logo?: File | null;
  bannerPhoto?: File | null;
}

export interface CampusResponse {
  id: number;
  fullName: string;
  nicknames: string[];
  motto?: string;
  type: CampusApiType;
  location: string;
  logo?: string;
  bannerPhoto?: string;
  createdAt: string;
}

export interface CreateProgrammeInput {
  fullName: string;
  nicknames: string[];
  bio?: string;
  durationFromYear: number;
  durationToYear: number;
  coverPhoto?: File | null;
}

export interface ProgrammeResponse {
  id: number;
  fullName: string;
  nicknames: string[];
  bio?: string;
  durationFrom: number;
  durationTo: number;
  coverPhoto?: string;
  createdAt: string;
}

export interface CreateTagInput {
  mainTitle: string;
  tags: string[];
  image?: File | null;
}

export interface TagResponse {
  id: number;
  mainTitle: string;
  tags: string[];
  image?: string;
  createdAt: string;
}

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
