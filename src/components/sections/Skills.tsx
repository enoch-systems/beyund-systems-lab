import SectionHeader from "@/components/ui/SectionHeader";
import SkillCard from "@/components/ui/SkillCard";
import { skills } from "@/data";

export default function Skills() {
  return (
    <section id="skills" className="py-24 animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Skills & Tech Stack" subtitle="Core competencies and technologies I work with" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkillCard category="Backend" skills={skills.backend} />
          <SkillCard category="Framework" skills={skills.framework} />
          <SkillCard category="Systems" skills={skills.systems} />
          <SkillCard category="Tools" skills={skills.tools} />
        </div>
      </div>
    </section>
  );
}
