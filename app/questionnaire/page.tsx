'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProgressBar from '@/components/ProgressBar';
import QuestionCard from '@/components/QuestionCard';
import questionnaireData from '@/lib/questionnaire.json';

const LOADING_STEPS = [
  { label: 'Leyendo tus respuestas...', duration: 600 },
  { label: 'Evaluando 35 tech stacks...', duration: 900 },
  { label: 'Calculando compatibilidad...', duration: 700 },
  { label: 'Generando tu roadmap...', duration: 600 },
  { label: '¡Listo! Preparando resultados...', duration: 400 },
];

// Skip logic: when a trigger answer is selected, auto-fill and hide certain questions
const SKIP_RULES: Record<string, { skipIds: string[]; defaults: Record<string, string> }> = {
  'q4:non_technical': {
    skipIds: ['q6', 'q10', 'q11'],
    defaults: { q6: 'not_critical', q10: 'no_preference', q11: 'no_preference' },
  },
};

function LoadingScreen() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    let idx = 0;
    const advance = () => {
      idx++;
      if (idx < LOADING_STEPS.length) {
        setStepIndex(idx);
        setTimeout(advance, LOADING_STEPS[idx].duration);
      }
    };
    const timer = setTimeout(advance, LOADING_STEPS[0].duration);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Spinner */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-slate-600" />
          <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-3xl">
            🔍
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analizando tu proyecto</h2>
        <p className="text-gray-500 dark:text-slate-400 mb-8">Esto solo toma un momento...</p>

        {/* Steps */}
        <div className="space-y-3 text-left">
          {LOADING_STEPS.map((step, i) => (
            <div key={i} className={`flex items-center gap-3 transition-all duration-300 ${
              i < stepIndex ? 'opacity-100' : i === stepIndex ? 'opacity-100' : 'opacity-30'
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                i < stepIndex
                  ? 'bg-accent text-white'
                  : i === stepIndex
                  ? 'bg-primary text-white animate-pulse'
                  : 'bg-gray-200 dark:bg-slate-600 text-gray-400'
              }`}>
                {i < stepIndex ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-medium ${
                i <= stepIndex ? 'text-gray-800 dark:text-slate-100' : 'text-gray-400 dark:text-slate-600'
              }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function QuestionnairePage() {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Flatten all questions from all sections
  const baseQuestions = questionnaireData.sections.flatMap((section) =>
    section.questions.map((q) => ({
      ...q,
      sectionTitle: section.title,
      sectionDescription: section.description,
    }))
  );

  // Compute which question IDs to skip based on current answers
  const skippedIds = new Set<string>();
  const autoAnswers: Record<string, string> = {};
  for (const [key, rule] of Object.entries(SKIP_RULES)) {
    const [qId, val] = key.split(':');
    if (answers[qId] === val) {
      rule.skipIds.forEach((id) => skippedIds.add(id));
      Object.assign(autoAnswers, rule.defaults);
    }
  }

  // Visible questions exclude skipped ones
  const allQuestions = baseQuestions.filter((q) => !skippedIds.has(q.id));

  const currentQuestion = allQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === allQuestions.length - 1;
  const currentAnswer = answers[currentQuestion?.id] || '';

  const handleAnswer = (value: string) => {
    setAnswers((prev) => {
      const next = { ...prev, [currentQuestion.id]: value };
      // Apply skip-logic auto-answers when a trigger is selected
      for (const [key, rule] of Object.entries(SKIP_RULES)) {
        const [qId, triggerVal] = key.split(':');
        if (currentQuestion.id === qId && value === triggerVal) {
          Object.assign(next, rule.defaults);
        }
        // Clear auto-answers if user changes away from the trigger value
        if (currentQuestion.id === qId && value !== triggerVal) {
          rule.skipIds.forEach((id) => {
            if (next[id] === rule.defaults[id]) delete next[id];
          });
        }
      }
      return next;
    });
  };

  const handleNext = useCallback(() => {
    // Re-compute visible length at call time via closure over allQuestions
    setCurrentQuestionIndex((i) => {
      if (i < allQuestions.length - 1) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return i + 1;
      }
      return i;
    });
  }, [allQuestions.length]);

  const handleBack = useCallback(() => {
    setCurrentQuestionIndex((i) => {
      if (i > 0) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return i - 1;
      }
      return i;
    });
  }, []);

  // If skipping questions shrinks the list past our current index, clamp it
  useEffect(() => {
    if (currentQuestionIndex >= allQuestions.length) {
      setCurrentQuestionIndex(Math.max(0, allQuestions.length - 1));
    }
  }, [allQuestions.length, currentQuestionIndex]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Merge visible answers with auto-filled skipped answers
    const finalAnswers = { ...autoAnswers, ...answers };
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const result = await response.json();
      if (!response.ok || !result.primary) {
        throw new Error(result.error || 'No se pudo generar la recomendación');
      }
      sessionStorage.setItem('stackAdvisorResult', JSON.stringify(result));
      // Store raw answers so the share URL can reconstruct results
      sessionStorage.setItem('stackAdvisorAnswers', JSON.stringify(finalAnswers));
      // Wait for loading animation to finish (min ~3.2s total)
      await new Promise((r) => setTimeout(r, 3300));
      router.push('/results');
    } catch (error) {
      console.error('Error getting recommendation:', error);
      alert('Algo salió mal al generar tu recomendación. Por favor intentá de nuevo.');
      setIsSubmitting(false);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitting) return;
      // Don't intercept when typing in textarea
      if ((e.target as HTMLElement).tagName === 'TEXTAREA') return;

      // Number keys to select options
      const q = currentQuestion as any;
      if (q.type !== 'text' && q.options) {
        const num = parseInt(e.key);
        if (!isNaN(num) && num >= 1 && num <= q.options.length) {
          const option = q.options[num - 1];
          handleAnswer(option.value);
          // Auto-advance after keyboard selection
          if (!isLastQuestion) {
            setTimeout(handleNext, 400);
          }
          return;
        }
      }

      // Enter to advance / submit
      if (e.key === 'Enter') {
        if (isLastQuestion && currentAnswer) {
          handleSubmit();
        } else if (currentAnswer || !currentQuestion.required) {
          handleNext();
        }
        return;
      }

      // Backspace / ArrowLeft to go back
      if (e.key === 'Backspace' || e.key === 'ArrowLeft') {
        if ((e.target as HTMLElement).tagName !== 'INPUT') {
          handleBack();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, currentAnswer, isLastQuestion, isSubmitting, handleNext, handleBack]);

  // Show loading screen while submitting
  if (isSubmitting) {
    return <LoadingScreen />;
  }

  // Show section title only on first question of each section
  const showSectionHeader =
    currentQuestionIndex === 0 ||
    currentQuestion.sectionTitle !== allQuestions[currentQuestionIndex - 1]?.sectionTitle;

  // Section indicator
  const sections = questionnaireData.sections;
  const currentSectionTitle = currentQuestion.sectionTitle;
  const currentSectionIndex = sections.findIndex((s) => s.title === currentSectionTitle);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
            Cuestionario de Recomendación
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            Responde {allQuestions.length} preguntas · Resultados instantáneos
          </p>
          {skippedIds.size > 0 && (
            <p className="text-xs text-accent font-medium mt-1">
              ✓ Simplificado para no-técnicos — {skippedIds.size} preguntas técnicas omitidas
            </p>
          )}
        </div>

        {/* Section indicator */}
        <div className="max-w-3xl mx-auto mb-4 flex gap-2">
          {sections.map((section, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                i < currentSectionIndex
                  ? 'bg-accent'
                  : i === currentSectionIndex
                  ? 'bg-primary'
                  : 'bg-gray-200 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>
        <div className="max-w-3xl mx-auto mb-1 flex justify-between">
          {sections.map((section, i) => (
            <span key={i} className={`text-xs ${
              i === currentSectionIndex ? 'text-primary font-medium' : 'text-gray-400 dark:text-slate-600'
            }`}>
              {section.title}
            </span>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="max-w-3xl mx-auto mb-8 mt-4">
          <ProgressBar
            key={`progress-${currentQuestionIndex}`}
            current={currentQuestionIndex + 1}
            total={allQuestions.length}
          />
        </div>

        {/* Question Card */}
        <QuestionCard
          key={`question-${currentQuestionIndex}`}
          question={currentQuestion}
          value={currentAnswer}
          onChange={handleAnswer}
          onAutoAdvance={!isLastQuestion ? handleNext : undefined}
          sectionTitle={showSectionHeader ? currentQuestion.sectionTitle : undefined}
          sectionDescription={showSectionHeader ? currentQuestion.sectionDescription : undefined}
        />

        {/* Navigation Buttons */}
        <div className="max-w-3xl mx-auto mt-8 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentQuestionIndex === 0
                ? 'bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-slate-600 cursor-not-allowed'
                : 'bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-500 text-gray-700 dark:text-slate-300 hover:border-primary hover:text-primary'
            }`}
          >
            ← Atrás
          </button>

          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              disabled={!currentAnswer && currentQuestion.required}
              className={`px-8 py-3 rounded-lg font-medium transition-all ${
                !currentAnswer && currentQuestion.required
                  ? 'bg-gray-300 dark:bg-slate-600 text-gray-500 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-blue-600 shadow-lg transform hover:scale-105'
              }`}
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (!currentAnswer && currentQuestion.required)}
              className="px-8 py-3 rounded-lg font-medium bg-accent text-white hover:bg-green-600 shadow-lg transform hover:scale-105 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
            >
              Obtener Recomendación 🚀
            </button>
          )}
        </div>

        {/* Helper text */}
        {currentQuestion.required && !currentAnswer && (
          <div className="max-w-3xl mx-auto mt-4 text-center">
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Selecciona una respuesta para continuar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
