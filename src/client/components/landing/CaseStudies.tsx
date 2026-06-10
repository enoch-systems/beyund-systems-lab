import SectionHeader from "@/client/components/common/SectionHeader";
import { caseStudies } from "@/shared/constants/data";

export default function CaseStudies() {
  return (
    <section id="case-studies" className="py-24 bg-slate-50 animate-fade-in">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Case Studies" subtitle="Deep dive into selected projects" />
        <div className="space-y-12">
          {caseStudies.map((study) => (
            <div
              key={study.id}
              className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
            >
              <h3 className="text-2xl font-normal text-slate-950 mb-4">{study.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-normal text-slate-950 mb-2">Problem</h4>
                  <p className="text-slate-600 mb-4">{study.problem}</p>
                  <h4 className="font-normal text-slate-950 mb-2">Solution</h4>
                  <p className="text-slate-600 mb-4">{study.solution}</p>
                </div>
                <div>
                  <h4 className="font-normal text-slate-950 mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {study.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-normal text-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <h4 className="font-normal text-slate-950 mb-2">Results</h4>
                  <ul className="space-y-2">
                    {study.results.map((result, index) => (
                      <li key={index} className="flex items-start gap-2 text-slate-600">
                        <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
