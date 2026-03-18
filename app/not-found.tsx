import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-6xl font-black text-gray-900 dark:text-white mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-700 dark:text-slate-200 mb-4">
          Página no encontrada
        </h2>
        <p className="text-gray-500 dark:text-slate-400 mb-8 leading-relaxed">
          El stack que buscás no existe o la URL cambió. Pero tenemos 35 stacks
          increíbles esperándote.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-all shadow-md"
          >
            Ir al inicio
          </Link>
          <Link
            href="/stacks"
            className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 px-6 py-3 rounded-xl font-medium hover:border-primary hover:text-primary transition-all"
          >
            Ver todos los stacks
          </Link>
          <Link
            href="/questionnaire"
            className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-300 px-6 py-3 rounded-xl font-medium hover:border-primary hover:text-primary transition-all"
          >
            Hacer el cuestionario
          </Link>
        </div>
      </div>
    </div>
  );
}
