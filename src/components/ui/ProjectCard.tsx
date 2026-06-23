import Image from "next/image";

export default function ProjectCard({ project }: { project: any }) {
  return (
    <div className="group rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <div className="aspect-video w-full bg-slate-100 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-normal text-slate-950 mb-2">{project.title}</h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech: string) => (
            <span
              key={tech}
              className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-normal text-slate-700"
            >
              {tech}
            </span>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-normal text-white transition hover:bg-slate-800"
          >
            Live Demo
          </a>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-normal text-slate-950 transition hover:bg-slate-50"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
