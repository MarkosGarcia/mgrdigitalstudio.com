import { Hero } from "@/components/Hero";
import { ProblemSolution } from "@/components/ProblemSolution";
import { ServicesOverview } from "@/components/ServicesOverview";
import { ProcessSteps } from "@/components/ProcessSteps";
import { WorkPreview } from "@/components/WorkPreview";
import { StudioNote } from "@/components/StudioNote";
import { FitSection } from "@/components/FitSection";
import { CTASection } from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSolution />
      <ServicesOverview />
      <ProcessSteps />
      <WorkPreview />
      <StudioNote />
      <FitSection />
      <CTASection />
    </>
  );
}
