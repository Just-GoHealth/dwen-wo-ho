export interface School {
  id: number;
  name: string;
  nickname: string;
  logo: string;
  type: string;
  totalProviders?: number;
  totalPartners?: number;
  campuses: string[] | null;
  createdAt: string;
}

export interface ICreateSchool {
  name: string;
  nickname: string;
  type: string;
  baseline: string;
  campuses: string[];
  logo: File | null;
}

export interface IUpdateSchool {
  id: string | number;
  name?: string;
  nickname?: string;
  type?: string;
  baseline?: string;
  campuses?: string[];
  logo?: File | null;
}
