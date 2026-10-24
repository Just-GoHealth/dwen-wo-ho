import { FilterType } from "@/lib/types/components/provider/schools";

export const filterOptions: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "JHS", value: "JHS" },
  { label: "SHS", value: "SHS" },
  { label: "COLLEGE", value: "COLLEGE" },
];
