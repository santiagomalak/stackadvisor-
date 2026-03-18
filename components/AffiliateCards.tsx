import { getAffiliatesForHosting } from '@/lib/affiliates';

interface Props {
  hosting: string;
  variant?: 'sidebar' | 'inline';
}

export default function AffiliateCards({ hosting, variant = 'sidebar' }: Props) {
  const affiliates = getAffiliatesForHosting(hosting);
  if (!affiliates.length) return null;

  if (variant === 'sidebar') {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
        <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">
          🎁 Empezá con créditos gratis
        </h3>
        <p className="text-xs text-gray-500 dark:text-slate-400 mb-4">
          Plataformas recomendadas para este stack
        </p>
        <div className="space-y-3">
          {affiliates.map((aff) => (
            <a
              key={aff.name}
              href={aff.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex items-center gap-3 border-2 border-gray-100 dark:border-slate-700 rounded-xl p-3 hover:border-primary dark:hover:border-primary transition-all group"
            >
              <span className="text-2xl flex-shrink-0">{aff.logo}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                    {aff.name}
                  </span>
                  <span className="text-xs bg-accent/10 text-accent border border-accent/20 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                    {aff.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-tight">
                  {aff.description}
                </p>
              </div>
              <span className="text-gray-300 dark:text-slate-600 group-hover:text-primary transition-colors flex-shrink-0 text-sm">→</span>
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-400 dark:text-slate-600 mt-3 text-center">
          * Links de afiliado — nos ayudan a mantener StackAdvisor gratuito
        </p>
      </div>
    );
  }

  // inline variant — para la página de resultados
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 mb-8 print:hidden">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🎁</span>
        <h2 className="font-bold text-gray-900 dark:text-white">
          Empezá con créditos gratis
        </h2>
        <span className="text-xs bg-accent/10 text-accent border border-accent/20 px-2 py-0.5 rounded-full font-medium">
          Oferta para nuevos usuarios
        </span>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {affiliates.map((aff) => (
          <a
            key={aff.name}
            href={aff.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-start gap-3 border-2 border-gray-100 dark:border-slate-700 rounded-xl p-4 hover:border-primary dark:hover:border-primary hover:shadow-md transition-all group"
          >
            <span className="text-3xl flex-shrink-0">{aff.logo}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                  {aff.name}
                </span>
                <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-semibold">
                  {aff.badge}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed mb-2">
                {aff.description}
              </p>
              <span className="text-xs font-medium text-primary group-hover:underline">
                {aff.cta}
              </span>
            </div>
          </a>
        ))}
      </div>
      <p className="text-xs text-gray-400 dark:text-slate-600 mt-3">
        * Links de afiliado. StackAdvisor recibe una pequeña comisión si te registrás, sin costo extra para vos.
      </p>
    </div>
  );
}
