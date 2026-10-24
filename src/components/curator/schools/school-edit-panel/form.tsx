"use client";

import { MapPin, ChevronDown } from "lucide-react";
import { m, AnimatePresence } from "motion/react";
import { SchoolEditPanelFormProps } from "@/lib/types/components/curator/schools/schools";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-destructive text-xs font-medium">
      {message}
    </p>
  );
}

export const SchoolEditForm = ({
  formData,
  handleInputChange,
  campusTypes,
  locations,
  selectedLocationName,
  showCampusDropdown,
  setShowCampusDropdown,
  handleLocationSelect,
  campusDropdownRef,
  handleSubmit,
  fieldError,
  school,
}: SchoolEditPanelFormProps) => {
  return (
    <form id="school-edit-form" onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label className="text-foreground text-sm font-semibold">
            School Name
          </Label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            aria-invalid={!!fieldError("fullName")}
            className="bg-muted/50 border-border focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
            placeholder="e.g. Achimota School"
          />
          <FieldError message={fieldError("fullName")} />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground text-sm font-semibold">
            Nickname (Optional)
          </Label>
          <Input
            type="text"
            value={formData.nickname}
            onChange={(e) => handleInputChange("nickname", e.target.value)}
            aria-invalid={!!fieldError("nicknames")}
            className="bg-muted/50 border-border focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
            placeholder="e.g. Motown"
          />
          <FieldError message={fieldError("nicknames")} />
        </div>
      </div>

      {/* Motto */}
      <div className="space-y-2">
        <Label className="text-foreground text-sm font-semibold">Motto</Label>
        <Textarea
          value={formData.motto}
          onChange={(e) => handleInputChange("motto", e.target.value)}
          aria-invalid={!!fieldError("motto")}
          className="bg-muted/50 border-border focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground w-full resize-none rounded-xl border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
          placeholder="Enter school motto"
          rows={3}
        />
        <FieldError message={fieldError("motto")} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <Label className="text-foreground text-lg font-bold sm:w-24">
          Type
        </Label>
        <div className="flex flex-1 flex-wrap gap-2 sm:gap-4">
          {campusTypes.map((type) => (
            <Button
              key={type.code}
              type="button"
              title={type.label}
              onClick={() => handleInputChange("type", type.code)}
              className={`rounded-lg px-4 py-2 font-bold transition-colors sm:px-6 ${
                formData.type === type.code
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {type.code}
            </Button>
          ))}
        </div>
      </div>
      <FieldError message={fieldError("type")} />

      <div className="space-y-3">
        <Label className="text-foreground text-sm font-semibold">
          Location
        </Label>
        <div className="relative" ref={campusDropdownRef}>
          <Button
            type="button"
            onClick={() => setShowCampusDropdown(!showCampusDropdown)}
            className="bg-muted/50 border-border hover:bg-muted flex h-auto w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors"
          >
            <div className="text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span
                className={
                  selectedLocationName
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }
              >
                {selectedLocationName || "Select a location"}
              </span>
            </div>
            <ChevronDown
              className={`text-muted-foreground h-4 w-4 transition-transform duration-200 ${
                showCampusDropdown ? "rotate-180" : ""
              }`}
            />
          </Button>

          <AnimatePresence>
            {showCampusDropdown && (
              <m.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-card border-border absolute top-full right-0 left-0 z-20 mt-2 overflow-hidden rounded-xl border shadow-xl"
              >
                <div className="no-scrollbar max-h-48 overflow-y-auto p-2">
                  {locations.map((location) => (
                    <Button
                      key={location.id}
                      type="button"
                      onClick={() => handleLocationSelect(location.id)}
                      variant="ghost"
                      className={`w-full justify-start rounded-lg px-4 py-2.5 transition-colors ${
                        formData.locationId === location.id
                          ? "bg-primary/10 text-primary hover:bg-primary/20 font-medium"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <span>{location.name}</span>
                    </Button>
                  ))}
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
        <FieldError message={fieldError("locationId")} />
      </div>

      {school.logo && (
        <div className="space-y-3">
          <Label className="text-foreground text-sm font-semibold">
            School Logo
          </Label>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <div className="inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element -- rendered directly, no optimization */}
                <img
                  src={school.logo}
                  alt="School logo"
                  className="border-border h-32 w-32 rounded-lg border object-cover shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
