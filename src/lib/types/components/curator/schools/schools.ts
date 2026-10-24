import type { CuratorSchool } from "@/lib/types/components/curator/schools/campus";
import type { CampusType } from "@/lib/v2/curator/types";
import type { Location } from "@/lib/v2/curator/campuses";

export interface SchoolEditFormData {
  name: string;
  /** The first nickname; the others are kept as they are. */
  nickname: string;
  motto: string;
  /** A campus-type code from GET /campus-types. */
  type: string;
  locationId: string;
}

export interface SchoolEditPanelFooterProps {
  handleDisable: () => void;
  isPending: boolean;
  hasChanges: boolean;
}

export interface SchoolEditPanelFormProps {
  formData: SchoolEditFormData;
  handleInputChange: (field: keyof SchoolEditFormData, value: string) => void;
  campusTypes: CampusType[];
  locations: Location[];
  selectedLocationName: string;
  showCampusDropdown: boolean;
  setShowCampusDropdown: (show: boolean) => void;
  handleLocationSelect: (locationId: string) => void;
  campusDropdownRef: React.RefObject<HTMLDivElement | null>;
  handleSubmit: (e: React.SubmitEvent) => void;
  /** RFC 9457 `fields[]` message for one field, shown beside it. */
  fieldError: (field: string) => string | undefined;
  school: CuratorSchool;
}

export interface SchoolEditPanelHeaderProps {
  onClose: () => void;
}
