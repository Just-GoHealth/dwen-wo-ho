"use client";

import { MapPin, ChevronDown } from "lucide-react";
import { m, AnimatePresence } from "motion/react";
import { CAMPUS_OPTIONS } from "@/lib/constants/components/curator/schools/school-forms";
import { SCHOOL_TYPES } from "@/lib/constants/components/curator/schools/school-forms";
import { SchoolEditPanelFormProps } from "@/lib/types/components/curator/schools/schools";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const SchoolEditForm = ({
  formData,
  handleInputChange,
  showCampusDropdown,
  setShowCampusDropdown,
  selectedCampuses,
  handleCampusToggle,
  campusDropdownRef,
  handleSubmit,
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
            className="bg-muted/50 border-border focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
            placeholder="e.g. Achimota School"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground text-sm font-semibold">
            Nickname (Optional)
          </Label>
          <Input
            type="text"
            value={formData.nickname}
            onChange={(e) => handleInputChange("nickname", e.target.value)}
            className="bg-muted/50 border-border focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground w-full rounded-xl border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
            placeholder="e.g. Motown"
          />
        </div>
      </div>

      {/* Motto */}
      <div className="space-y-2">
        <Label className="text-foreground text-sm font-semibold">
          Motto <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={formData.motto}
          onChange={(e) => handleInputChange("motto", e.target.value)}
          className="bg-muted/50 border-border focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground w-full resize-none rounded-xl border px-4 py-3 transition-all focus:ring-2 focus:outline-none"
          placeholder="Enter school motto"
          rows={3}
        />
      </div>

      <div className="flex items-center gap-6">
        <Label className="text-foreground w-24 text-lg font-bold">Type</Label>
        <div className="flex flex-1 flex-wrap gap-4">
          {SCHOOL_TYPES.map((type) => (
            <Button
              key={type}
              type="button"
              onClick={() => handleInputChange("type", type)}
              className={`rounded-lg px-6 py-2 font-bold transition-colors ${
                formData.type === type
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-foreground text-sm font-semibold">
            Campuses
          </Label>
          {selectedCampuses.length > 0 && (
            <span className="rounded-full bg-teal-50 px-2 py-1 text-xs font-medium text-teal-600">
              {selectedCampuses.length} selected
            </span>
          )}
        </div>
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
                  selectedCampuses.length > 0
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }
              >
                {selectedCampuses.length > 0
                  ? selectedCampuses.join(", ")
                  : "Select campus locations"}
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
                  {CAMPUS_OPTIONS.map((campus) => (
                    <Button
                      key={campus}
                      type="button"
                      onClick={() => handleCampusToggle(campus)}
                      variant="ghost"
                      className={`w-full justify-start rounded-lg px-4 py-2.5 transition-colors ${
                        selectedCampuses.includes(campus)
                          ? "bg-primary/10 text-primary hover:bg-primary/20 font-medium"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <span>{campus}</span>
                    </Button>
                  ))}
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </div>
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
