"use client";

import { SchoolEditPanelProps } from "@/lib/types/components/shared/overlays";
import { useSchoolEdit } from "@/hooks/components/curator/schools/use-school-edit";
import { useClickOutside } from "@/hooks/shared/use-click-outside";
import { AnimatedModalShell } from "@/components/overlays/shared/animated-modal-shell";
import { SchoolEditHeader } from "./header";
import { SchoolEditForm } from "./form";
import { SchoolEditFooter } from "./footer";
import type { CuratorSchool } from "@/lib/types/components/curator/schools/campus";

const SchoolEditPanel = ({
  isOpen,
  onClose,
  school,
  onSchoolUpdated,
  onDisableSchool,
}: SchoolEditPanelProps) => {
  // The school screens load v2 campuses (useSchool → CuratorSchool).
  const campus = school as CuratorSchool;
  const {
    showCampusDropdown,
    setShowCampusDropdown,
    formData,
    campusTypes,
    locations,
    selectedLocationName,
    updateSchoolMutation,
    campusDropdownRef,
    hasChanges,
    fieldError,
    handleInputChange,
    handleLocationSelect,
    handleSubmit,
    handleDisable,
  } = useSchoolEdit({
    school: campus,
    onClose,
    onSchoolUpdated,
    onDisableSchool,
  });

  useClickOutside(campusDropdownRef, () => {
    setShowCampusDropdown(false);
  });

  return (
    <AnimatedModalShell
      isOpen={isOpen}
      onClose={onClose}
      backdropClassName="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      panelClassName="max-h-[90vh] max-w-2xl rounded-3xl"
    >
      <SchoolEditHeader onClose={onClose} />

      <div className="no-scrollbar flex-1 overflow-y-auto p-4 sm:p-8">
        <SchoolEditForm
          formData={formData}
          handleInputChange={handleInputChange}
          campusTypes={campusTypes}
          locations={locations}
          selectedLocationName={selectedLocationName}
          showCampusDropdown={showCampusDropdown}
          setShowCampusDropdown={setShowCampusDropdown}
          handleLocationSelect={handleLocationSelect}
          campusDropdownRef={campusDropdownRef}
          handleSubmit={handleSubmit}
          fieldError={fieldError}
          school={campus}
        />
      </div>

      <SchoolEditFooter
        handleDisable={handleDisable}
        isPending={updateSchoolMutation.isPending}
        hasChanges={hasChanges}
      />
    </AnimatedModalShell>
  );
};

export default SchoolEditPanel;
