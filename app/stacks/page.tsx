import Link from 'next/link';
import stacksData from '@/lib/stacks.json';
import StacksGrid from '@/components/StacksGrid';

const STACKS = (stacksData as any).stacks;

export const metadata = {
  title: 'Explorar Tech Stacks — StackAdvisor',
  description: 'Descubrí los 35 tech stacks más importantes de 2026, con pros, contras, costos y recursos para aprender.',
};

export default function StacksPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Explorá los {STACKS.length} Tech Stacks
          </h1>
          <p className="text-lg text-gray-500 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Todos los stacks evaluados por StackAdvisor, con pros, contras, costos y recursos.
            Hacé click en cualquiera para ver el análisis completo.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/questionnaire"
              className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-all shadow-md"
            >
              Obtener mi recomendación personalizada →
            </Link>
            <Link
              href="/compare"
              className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 px-6 py-3 rounded-lg font-medium hover:border-primary hover:text-primary transition-all"
            >
              ⚖️ Comparar stacks
            </Link>
          </div>
        </div>

        <StacksGrid stacks={STACKS} />
      </div>
    </div>
  );
}
