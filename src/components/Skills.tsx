import SectionHeader from "./SectionHeader";
import SkillCard from "./SkillCard";
import { skills } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" className="py-24 animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Skills & Tech Stack" subtitle="Technologies I work with" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkillCard category="Frontend" skills={skills.frontend} />
          <SkillCard category="Backend" skills={skills.backend} />
          <SkillCard category="Database" skills={skills.database} />
          <SkillCard category="Tools" skills={skills.tools} />
          <SkillCard category="Others" skills={skills.others} />
        </div>
      </div>
    </section>
  );
}
