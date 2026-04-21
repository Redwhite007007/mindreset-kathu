import { BrainRebootMeter } from "@/components/dashboard/BrainRebootMeter";
import { TodayQuestCard } from "@/components/dashboard/TodayQuestCard";
import { StreakFlame } from "@/components/dashboard/StreakFlame";
import { WeekProgressRow } from "@/components/dashboard/WeekProgressRow";

export default function DashboardPage() {
  return (
    <div className="space-y-6 px-4 py-6">
      <header className="space-y-2 text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-[var(--color-reboot-muted)]">
          Howzit Kathu fam! 💥
        </p>
        <h1 className="text-2xl font-black tracking-tight text-[var(--color-reboot-electric)]">
          Ready to reboot your mind today?
        </h1>
        <p className="text-base text-[var(--color-reboot-text)]">
          One day at a time, let&apos;s get that brain firing on all cylinders. 🚀
        </p>
      </header>
      <BrainRebootMeter />
      <TodayQuestCard />
      <StreakFlame />
      <WeekProgressRow />
    </div>
  );
}
