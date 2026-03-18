interface RoadmapWeek {
  week: number;
  title: string;
  tasks: string[];
}

interface RoadmapProps {
  roadmap: RoadmapWeek[];
}

export default function Roadmap({ roadmap }: RoadmapProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Tu Roadmap de 12 Semanas a Producción
      </h2>

      <div className="space-y-4">
        {roadmap.map((week) => (
          <div
            key={week.week}
            className="roadmap-week bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-lg p-6 hover:border-primary dark:hover:border-primary transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="roadmap-circle w-12 h-12 bg-gradient-to-br from-primary to-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {week.week}
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {week.title}
                </h3>

                <ul className="space-y-2">
                  {week.tasks.map((task, taskIndex) => (
                    <li
                      key={taskIndex}
                      className="flex items-start gap-2 text-gray-700 dark:text-slate-300"
                    >
                      <span className="text-accent mt-1">✓</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
