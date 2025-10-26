export interface School {
  id: number;
  name: string;
  nickname: string;
  logo: string;
  type: string;
  totalProviders: number;
  totalPartners: number;
  campuses: string[];
  createdAt: string;
}

export interface ICreateSchool {
  name: string;
  nickname: string;
  type: string;
  baseline: string;
  campuses: string[];
  logo: File;
}
