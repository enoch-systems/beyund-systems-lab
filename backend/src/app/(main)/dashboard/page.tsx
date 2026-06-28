import { MetricCards } from "./default/_components/metric-cards";
import { PerformanceOverview } from "./default/_components/performance-overview";
import { SubscriberOverview } from "./default/_components/subscriber-overview";

export default function Page() {
  return (
    <div className="@container/main flex flex-col gap-4 md:gap-6">
      <MetricCards />
      <PerformanceOverview />
      <SubscriberOverview />
    </div>
  );
}