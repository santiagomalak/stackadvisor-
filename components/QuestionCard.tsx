'use client';

import { useEffect, useRef } from 'react';

interface Option {
  id: string;
  label: string;
  value: string;
  description?: string;
}

interface Question {
  id: string;
  question: string;
  type: string;
  options?: Option[];
  placeholder?: string;
  maxLength?: number;
}

interface QuestionCardProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  onAutoAdvance?: () => void;
  sectionTitle?: string;
  sectionDescription?: string;
}

export default function QuestionCard({
  question,
  value,
  onChange,
  onAutoAdvance,
  sectionTitle,
  sectionDescription,
}: QuestionCardProps) {
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    if (onAutoAdvance) {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = setTimeout(() => {
        onAutoAdvance();
      }, 350);
    }
  };

  useEffect(() => {
    return () => {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current);
    };
  }, []);

  const SectionHeader = () =>
    sectionTitle ? (
      <div className="mb-6 pb-4 border-b border-gray-100 dark:border-slate-600">
        <h2 className="text-xl font-bold text-primary">{sectionTitle}</h2>
        {sectionDescription && (
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">{sectionDescription}</p>
        )}
      </div>
    ) : null;

  if (question.type === 'text') {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
        <SectionHeader />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{question.question}</h3>
        <p className="text-gray-500 dark:text-slate-400 text-sm mb-5">
          Esta pregunta es opcional. Si no tienes nada especial, puedes dejarla en blanco y hacer clic en "Obtener Recomendación".
        </p>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || 'Escribe aquí si hay algo especial...'}
          maxLength={question.maxLength || 500}
          className="w-full p-4 border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 rounded-lg focus:border-primary focus:outline-none resize-none placeholder-gray-400 dark:placeholder-slate-500"
          rows={4}
          autoFocus
        />
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-2 text-right">
          {value.length} / {question.maxLength || 500} caracteres
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
      <SectionHeader />
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">{question.question}</h3>

      <div className="space-y-2.5">
        {question.options?.map((option, index) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.value)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-150 ${
              value === option.value
                ? 'border-primary bg-blue-50 dark:bg-blue-950 shadow-sm'
                : 'border-gray-200 dark:border-slate-600 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Number badge */}
              <span className={`flex-shrink-0 w-6 h-6 rounded text-xs font-bold flex items-center justify-center mt-0.5 ${
                value === option.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-slate-600 text-gray-500 dark:text-slate-400'
              }`}>
                {index + 1}
              </span>
              {/* Radio circle */}
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 ${
                  value === option.value
                    ? 'border-primary bg-primary'
                    : 'border-gray-300 dark:border-slate-500'
                }`}
              >
                {value === option.value && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              {/* Label + description */}
              <div className="flex-1 min-w-0">
                <div className={`font-medium text-sm md:text-base ${value === option.value ? 'text-primary' : 'text-gray-800 dark:text-slate-100'}`}>
                  {option.label}
                </div>
                {option.description && (
                  <div className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 leading-snug">
                    {option.description}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {question.options && question.options.length > 0 && (
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-4 text-center">
          Presiona <kbd className="bg-gray-100 dark:bg-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono">1</kbd>–<kbd className="bg-gray-100 dark:bg-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono">{question.options.length}</kbd> para seleccionar · <kbd className="bg-gray-100 dark:bg-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono">Enter</kbd> para avanzar
        </p>
      )}
    </div>
  );
}
