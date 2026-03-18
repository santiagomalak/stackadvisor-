interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
          Pregunta {current} de {total}
        </span>
        <span className="text-sm font-medium text-primary">
          {percentage}% completado
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-3 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
