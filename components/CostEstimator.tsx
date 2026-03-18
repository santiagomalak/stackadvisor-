'use client';

import { useState } from 'react';

interface Stack {
  id: string;
  name: string;
  estimatedCost: string;
}

// Base cost per tier of users
function estimateCost(stackId: string, users: number, teamSize: number): {
  breakdown: { item: string; cost: number }[];
  total: number;
  note: string;
} {
  const isManaged = ['supabase_nextjs', 'convex_react', 'pocketbase_react', 'shopify', 'nocode_bubble_flutterflow', 'wordpress_woocommerce'].includes(stackId);
  const isCloud = ['serverless_lambda_react', 'go_react_postgres', 'spring_react_postgres', 'aspnet_react_sqlserver'].includes(stackId);
  const isMobile = ['flutter_firebase', 'react_native_firebase'].includes(stackId);

  let hosting = 0;
  let database = 0;
  let bandwidth = 0;
  let extras = 0;
  let note = '';

  if (users <= 100) {
    hosting  = isManaged ? 0  : 5;
    database = isManaged ? 0  : 0;
    note     = 'Free tiers disponibles — costo real $0/mes';
  } else if (users <= 1000) {
    hosting  = isManaged ? 0  : 10;
    database = isManaged ? 0  : 15;
  } else if (users <= 10000) {
    hosting  = isCloud ? 40 : isManaged ? 25 : 20;
    database = isManaged ? 25 : 30;
    bandwidth = 5;
  } else if (users <= 100000) {
    hosting  = isCloud ? 150 : isManaged ? 100 : 80;
    database = isManaged ? 100 : 120;
    bandwidth = 20;
    extras   = 30; // monitoring, CDN
  } else {
    hosting  = isCloud ? 500 : isManaged ? 400 : 350;
    database = isManaged ? 400 : 500;
    bandwidth = 80;
    extras   = 100;
    note     = 'A este escala se requiere arquitectura dedicada — contactar a expertos';
  }

  // Firebase: costs scale with reads/writes
  if (isMobile && users > 1000) {
    hosting  = users > 10000 ? 150 : 20;
    database = users > 10000 ? 200 : 30;
    note     = 'Firebase escala con lecturas/escrituras — monitorear uso activamente';
  }

  // WordPress: hosting scales differently
  if (stackId === 'wordpress_woocommerce') {
    hosting  = users <= 1000 ? 10 : users <= 10000 ? 30 : users <= 100000 ? 80 : 300;
    database = 0; // incluido
    note     = users > 10000 ? 'A esta escala se recomienda WP Engine Business ($50/mes) + CDN' : '';
  }

  // Team tools
  const teamExtras = teamSize >= 3 ? 30 : teamSize >= 2 ? 15 : 0;

  const breakdown = [
    { item: 'Hosting / Infraestructura', cost: hosting },
    { item: 'Base de datos', cost: database },
    ...(bandwidth > 0 ? [{ item: 'Ancho de banda / CDN', cost: bandwidth }] : []),
    ...(extras > 0 ? [{ item: 'Monitoring / Extras', cost: extras }] : []),
    ...(teamExtras > 0 ? [{ item: 'Herramientas de equipo', cost: teamExtras }] : []),
  ].filter((b) => b.cost > 0);

  const total = breakdown.reduce((sum, b) => sum + b.cost, 0);
  return { breakdown, total, note };
}

const USER_OPTIONS = [
  { label: '< 100 usuarios', value: 100 },
  { label: '100 – 1,000 usuarios', value: 1000 },
  { label: '1,000 – 10,000 usuarios', value: 10000 },
  { label: '10,000 – 100,000 usuarios', value: 100000 },
  { label: '100,000+ usuarios', value: 1000001 },
];

const TEAM_OPTIONS = [
  { label: 'Solo developer', value: 1 },
  { label: '2 personas', value: 2 },
  { label: '3-5 personas', value: 4 },
  { label: '6+ personas', value: 6 },
];

export default function CostEstimator({ stack }: { stack: Stack }) {
  const [users, setUsers] = useState(1000);
  const [teamSize, setTeamSize] = useState(1);

  const { breakdown, total, note } = estimateCost(stack.id, users, teamSize);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Estimador de Costos
      </h2>
      <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
        Ajustá los parámetros para ver el costo estimado de {stack.name} en producción
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Users slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
            Usuarios activos mensuales
          </label>
          <div className="space-y-2">
            {USER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setUsers(opt.value)}
                className={`w-full text-left px-4 py-2.5 rounded-lg border-2 text-sm transition-all ${
                  users === opt.value
                    ? 'border-primary bg-blue-50 dark:bg-blue-950 text-primary font-medium'
                    : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-400 hover:border-primary'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Team + result */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
              Tamaño del equipo
            </label>
            <div className="space-y-2">
              {TEAM_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTeamSize(opt.value)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg border-2 text-sm transition-all ${
                    teamSize === opt.value
                      ? 'border-primary bg-blue-50 dark:bg-blue-950 text-primary font-medium'
                      : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-400 hover:border-primary'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Result card */}
          <div className="bg-gradient-to-br from-primary to-blue-700 rounded-xl p-5 text-white">
            <div className="text-sm opacity-80 mb-1">Costo estimado mensual</div>
            <div className="text-4xl font-bold mb-1">
              {total === 0 ? '$0' : `$${total}`}
              <span className="text-lg font-normal opacity-70">/mes</span>
            </div>
            <div className="text-sm opacity-70">para {stack.name.split('+')[0].trim()}</div>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      {breakdown.length > 0 && (
        <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">Desglose estimado</h3>
          <div className="space-y-2">
            {breakdown.map((item) => (
              <div key={item.item} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-slate-400">{item.item}</span>
                <span className="font-medium text-gray-900 dark:text-white">${item.cost}/mes</span>
              </div>
            ))}
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-100 dark:border-slate-700">
              <span className="text-gray-900 dark:text-white">Total estimado</span>
              <span className="text-primary">${total}/mes</span>
            </div>
          </div>
        </div>
      )}

      {note && (
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-xs text-yellow-800 dark:text-yellow-300">💡 {note}</p>
        </div>
      )}

      <p className="text-xs text-gray-400 dark:text-slate-600 mt-4">
        * Estimaciones aproximadas basadas en proveedores cloud estándar (AWS, GCP, DigitalOcean). Los precios reales varían según uso, región y proveedor.
      </p>
    </div>
  );
}
