"use client";

import { Check, Plus } from "lucide-react";
import WidthConstraint from "@/components/ui/width-constraint";
import { cn } from "@/lib/utils";
import { useSchoolsQuery } from "@/hooks/queries/useSchoolsQuery";


const mockProvider = {
  schoolName: "St. Augustine's College .3",
  specialization: "Provider (Clinical Psychologist)",
  timeframeLabel: "Today",
};



const mockAppointments = [
  {
    name: "Jimmy Stephen Newton",
    status: "Fully locked-in",
    score: 10,
    time: "2m",
    state: "pending" as const,
  },
  {
    name: "Joseph Maino Afful",
    status: "Seen by Dr. Frances Kwame Nkrumah",
    score: 10,
    time: "2m",
    state: "completed" as const,
  },
  {
    name: "Anthony Papa Eliason",
    status: "Fully locked-in",
    score: 10,
    time: "6d",
    state: "pending" as const,
  },
];

const ScoreBadge = ({ score }: { score: number }) => {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#23B573] text-2xl font-bold text-white">
      {score}
    </div>
  );
};

const AppointmentAction = ({ state }: { state: "pending" | "completed" }) => {
  if (state === "completed") {
    return (
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#23B573] text-white shadow-[0_4px_10px_rgba(35,181,115,0.35)]">
        <Check className="h-5 w-5" strokeWidth={2.5} />
      </span>
    );
  }

  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#2F2F2A] text-[#2F2F2A]">
      <Plus className="h-5 w-5" strokeWidth={2.5} />
    </span>
  );
};

const ProviderDetailPage = () => {
  const { getSchoolLockinQuery } = useSchoolsQuery();



  console.log(getSchoolLockinQuery('3'));
  return (
    <div className="min-h-screen bg-[#F8F7EF] text-[#1F1D16]">
      <main className="py-10">
        <WidthConstraint className="flex flex-col gap-8">
          <div className="text-center">
            <p className="text-base font-semibold uppercase tracking-[0.35em] text-[#636255]">
              {mockProvider.timeframeLabel}
            </p>
          </div>

          <section className="rounded-[32px] border border-[#E3E2D2] bg-[#F5F5E6] shadow-[0_15px_45px_rgba(65,65,45,0.08)]">
            <header className="grid grid-cols-[80px_1fr_auto] items-center gap-6 px-8 py-6 text-xs font-semibold uppercase tracking-[0.35em] text-[#6C6B5F]">
              <span>Score</span>
              <span className="justify-self-center text-[#1F1D16]">
                {mockProvider.timeframeLabel}
              </span>
              <span className="justify-self-end">Time</span>
            </header>

            <div className="divide-y divide-[#E3E2D2]">
              {mockAppointments.map((appointment, index) => (
                <article
                  key={appointment.name}
                  className={cn(
                    "grid grid-cols-[80px_1fr_auto] items-center gap-6 px-8 py-6",
                    index % 2 === 0 ? "bg-[#F9F8ED]" : "bg-[#F5F4E4]"
                  )}
                >
                  <div className="flex justify-center">
                    <ScoreBadge score={appointment.score} />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl font-semibold text-[#16804F]">
                      {appointment.name}
                    </h2>
                    <p className="text-sm text-[#5E5C50]">
                      {appointment.status}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <AppointmentAction state={appointment.state} />
                    <p className="text-sm font-semibold text-[#5E5C50]">
                      {appointment.time}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </WidthConstraint>
      </main>
    </div>
  );
};

export default ProviderDetailPage;
