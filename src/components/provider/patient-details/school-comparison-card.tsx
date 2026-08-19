"use client";

import { TrendingUp } from "lucide-react";
import { m } from "motion/react";
import { LockInAssessment } from "@/lib/types/entities/lockin";

interface SchoolComparisonCardProps {
  lockInAssessment: LockInAssessment;
}

export function SchoolComparisonCard({
  lockInAssessment,
}: SchoolComparisonCardProps) {
  if (!lockInAssessment?.schoolTypeAverages) return null;

  const averages = lockInAssessment.schoolTypeAverages;

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card border-border overflow-hidden rounded-2xl border shadow-sm"
    >
      <div className="border-border bg-muted/20 flex items-center gap-4 border-b px-6 py-4">
        <div className="bg-accent border-border rounded-xl border p-2 shadow-sm">
          <TrendingUp className="h-5 w-5 text-teal-600" />
        </div>
        <div>
          <h3 className="text-foreground text-lg font-bold tracking-tight">
            School Type Comparison
          </h3>
          <p className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
            {lockInAssessment.schoolType} Averages (n={averages.sampleSize})
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Locked In Score */}
        <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
          <span className="text-muted-foreground text-xs font-bold uppercase">
            Locked In Score
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-lg font-bold">
              {lockInAssessment.lockedInScore}
            </span>
            <span className="text-muted-foreground text-xs">
              avg: {averages.averageLockedInScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* General Mental Health */}
        <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
          <span className="text-muted-foreground text-xs font-bold uppercase">
            Mental Health
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-lg font-bold">
              {lockInAssessment.generalMentalHealthScore}
            </span>
            <span className="text-muted-foreground text-xs">
              avg: {averages.averageGeneralMentalHealthScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Depression */}
        <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
          <span className="text-muted-foreground text-xs font-bold uppercase">
            Depression
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-lg font-bold">
              {lockInAssessment.possibleDepressionScore}
            </span>
            <span className="text-muted-foreground text-xs">
              avg: {averages.averageDepressionScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Loneliness */}
        <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
          <span className="text-muted-foreground text-xs font-bold uppercase">
            Loneliness
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-lg font-bold">
              {lockInAssessment.lonelinessScore}
            </span>
            <span className="text-muted-foreground text-xs">
              avg: {averages.averageLonelinessScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Suicidality */}
        <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
          <span className="text-muted-foreground text-xs font-bold uppercase">
            Suicidality
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-lg font-bold">
              {lockInAssessment.suicidalRiskScore}
            </span>
            <span className="text-muted-foreground text-xs">
              avg: {averages.averageSuicidalityScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Exam Anxiety */}
        <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
          <span className="text-muted-foreground text-xs font-bold uppercase">
            Exam Anxiety
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-lg font-bold">
              {lockInAssessment.examAnxietyScore}
            </span>
            <span className="text-muted-foreground text-xs">
              avg: {averages.averageExamAnxietyScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Core Anxiety */}
        <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
          <span className="text-muted-foreground text-xs font-bold uppercase">
            Core Anxiety
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-lg font-bold">
              {lockInAssessment.coreAnxietyScore}
            </span>
            <span className="text-muted-foreground text-xs">
              avg: {averages.averageCoreAnxietyScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Physical Distress */}
        <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
          <span className="text-muted-foreground text-xs font-bold uppercase">
            Physical Distress
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-lg font-bold">
              {lockInAssessment.physicalDistressScore}
            </span>
            <span className="text-muted-foreground text-xs">
              avg: {averages.averagePhysicalDistressScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Exam Preparation */}
        <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
          <span className="text-muted-foreground text-xs font-bold uppercase">
            Exam Preparation
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-lg font-bold">
              {lockInAssessment.examPrepScore}
            </span>
            <span className="text-muted-foreground text-xs">
              avg: {averages.averageExamPreparationScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Motivation */}
        <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
          <span className="text-muted-foreground text-xs font-bold uppercase">
            Motivation
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-lg font-bold">
              {lockInAssessment.motivationScore}
            </span>
            <span className="text-muted-foreground text-xs">
              avg: {averages.averageMotivationScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Study Skills */}
        <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
          <span className="text-muted-foreground text-xs font-bold uppercase">
            Study Skills
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-lg font-bold">
              {lockInAssessment.studySkillsScore}
            </span>
            <span className="text-muted-foreground text-xs">
              avg: {averages.averageStudySkillsScore?.toFixed(2)}
            </span>
          </div>
        </div>
        {/* Procrastination */}
        <div className="bg-muted/30 flex flex-col gap-1 rounded-lg p-3">
          <span className="text-muted-foreground text-xs font-bold uppercase">
            Procrastination
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-lg font-bold">
              {lockInAssessment.procrastinationScore}
            </span>
            <span className="text-muted-foreground text-xs">
              avg: {averages.averageProcrastinationScore?.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </m.div>
  );
}
