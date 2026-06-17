export default function SkillCard({ category, skills }: { category: string; skills: any[] }) {
  return (
    <div className="rounded-2xl bg-white/10 p-6 shadow-sm ring-1 ring-white/20 backdrop-blur-sm">
      <h3 className="text-lg font-normal text-white mb-4 capitalize">{category}</h3>
      <div className="space-y-3">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-normal text-white/80">{skill.name}</span>
              <span className="text-white/50">{skill.level}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
