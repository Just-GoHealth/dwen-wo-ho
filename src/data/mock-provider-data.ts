import { AssociatedSchool, AssociatedPartner } from "@/types/provider";

export const mockSchools: AssociatedSchool[] = [
  {
    id: "1",
    name: "Achimota High School",
    joinedDate: "3d ago",
    isAssociated: true,
  },
  {
    id: "2",
    name: "Prempeh College",
    joinedDate: "1w ago",
    isAssociated: true,
  },
  {
    id: "3",
    name: "Wesley Girls High School",
    joinedDate: "2w ago",
    isAssociated: false,
  },
];

export const mockPartners: AssociatedPartner[] = [
  {
    id: "1",
    name: "SRC Prempeh College",
    joinedDate: "3d ago",
    isAssociated: true,
  },
  {
    id: "2",
    name: "OKB Hope Foundation",
    joinedDate: "1w ago",
    isAssociated: true,
  },
  {
    id: "3",
    name: "Mental Health Authority",
    joinedDate: "2w ago",
    isAssociated: false,
  },
];
