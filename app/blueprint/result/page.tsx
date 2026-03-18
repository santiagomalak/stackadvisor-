'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CONTACT_WHATSAPP = 'https://wa.me/5493834553249?text=Hola%20Santiago%2C%20compr%C3%A9%20el%20Blueprint%20de%20StackAdvisor%20y%20quiero%20coordinar%20mi%20sesi%C3%B3n%201%3A1';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

function parseInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="font-semibold text-gray-900 dark:text-white">{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`'))
      return <code key={i} className="font-mono text-xs bg-slate-100 dark:bg-slate-700 text-primary px-1.5 py-0.5 rounded">{part.slice(1, -1)}</code>;
    if (part.startsWith('*') && part.endsWith('*'))
      return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

function BlueprintMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <div key={i} className="my-3 rounded-xl overflow-hidden border border-slate-700">
          {lang && <div className="bg-slate-800 text-slate-400 text-xs px-4 py-1.5 font-mono">{lang}</div>}
          <pre className="bg-slate-900 text-green-400 text-xs font-mono p-4 overflow-x-auto leading-relaxed">
            {codeLines.join('\n')}
          </pre>
        </div>
      );
      i++;
      continue;
    }

    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-2xl font-black text-gray-900 dark:text-white mt-8 mb-3">{parseInline(line.slice(2))}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-lg font-bold text-primary mt-7 mb-3 pb-1 border-b border-gray-200 dark:border-slate-600">{parseInline(line.slice(3))}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-base font-bold text-gray-800 dark:text-slate-200 mt-5 mb-1.5">{parseInline(line.slice(4))}</h3>);
    } else if (line.startsWith('#### ')) {
      elements.push(<h4 key={i} className="text-sm font-bold text-gray-700 dark:text-slate-300 mt-3 mb-1">{parseInline(line.slice(5))}</h4>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={i} className="flex gap-2 items-start ml-2 my-0.5">
          <span className="text-primary font-bold mt-0.5 flex-shrink-0">•</span>
          <span className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed">{parseInline(line.slice(2))}</span>
        </div>
      );
    } else if (line.match(/^\d+\./)) {
      const num = line.match(/^(\d+)\./)?.[1];
      const rest = line.slice(line.indexOf('.') + 2);
      elements.push(
        <div key={i} className="flex gap-2 items-start ml-2 my-0.5">
          <span className="text-primary font-bold text-xs mt-0.5 flex-shrink-0 w-4">{num}.</span>
          <span className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed">{parseInline(rest)}</span>
        </div>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
    } else if (line.startsWith('---')) {
      elements.push(<hr key={i} className="border-gray-200 dark:border-slate-600 my-4" />);
    } else {
      elements.push(<p key={i} className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed my-0.5">{parseInline(line)}</p>);
    }
    i++;
  }

  return <div className="max-w-none space-y-0.5">{elements}</div>;
}

function ChatMarkdown({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="bg-slate-800 text-green-400 text-xs font-mono p-3 rounded-lg overflow-x-auto my-2 leading-relaxed">
          {codeLines.join('\n')}
        </pre>
      );
    } else if (line.startsWith('### ')) {
      elements.push(<p key={i} className="font-bold mt-2">{parseInline(line.slice(4))}</p>);
    } else if (line.startsWith('## ')) {
      elements.push(<p key={i} className="font-bold mt-2">{parseInline(line.slice(3))}</p>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={i} className="flex gap-1.5 items-start ml-1">
          <span className="font-bold mt-0.5 flex-shrink-0">•</span>
          <span>{parseInline(line.slice(2))}</span>
        </div>
      );
    } else if (line.match(/^\d+\./)) {
      const num = line.match(/^(\d+)\./)?.[1];
      elements.push(
        <div key={i} className="flex gap-1.5 items-start ml-1">
          <span className="font-bold text-xs mt-0.5 flex-shrink-0">{num}.</span>
          <span>{parseInline(line.slice(line.indexOf('.') + 2))}</span>
        </div>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-1.5" />);
    } else {
      elements.push(<span key={i} className="block">{parseInline(line)}</span>);
    }
    i++;
  }
  return <div className="space-y-0.5">{elements}</div>;
}

export default function BlueprintResultPage() {
  const router = useRouter();
  const [blueprint, setBlueprint] = useState('');
  const [answers, setAnswers] = useState<any>({});
  const [generating, setGenerating] = useState(true);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'chat'>('blueprint');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('blueprintAnswers');
    if (!stored) { router.push('/blueprint/extended'); return; }

    const parsedAnswers = JSON.parse(stored);
    setAnswers(parsedAnswers);

    // Generate blueprint
    fetch('/api/blueprint/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: parsedAnswers }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.blueprint) {
          setBlueprint(data.blueprint);
          sessionStorage.setItem('blueprintContent', data.blueprint);
          setMessages([{
            role: 'ai',
            content: `¡Listo! Tu Blueprint está generado 🎉 Leelo con calma y cuando tengas dudas sobre cualquier parte de tu proyecto, escribime acá. Tenés 50 mensajes incluidos.`,
          }]);
        } else {
          setError('Error generando el Blueprint. Intentá de nuevo.');
        }
        setGenerating(false);
      })
      .catch(() => { setError('Error de conexión.'); setGenerating(false); });
  }, [router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || chatLoading || messageCount >= 50) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/blueprint/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-10),
          blueprint,
          answers,
          messageCount,
        }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
      setMessageCount(data.messagesUsed || messageCount + 1);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', content: 'Error de conexión. Intentá de nuevo.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleCopyBlueprint = () => {
    navigator.clipboard.writeText(blueprint);
  };

  if (generating) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-sm px-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Generando tu Blueprint...</h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            La IA está analizando tus respuestas y construyendo tu plan personalizado. Tarda ~30 segundos.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-sm px-4">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Algo salió mal</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="container mx-auto px-4 max-w-5xl">

        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-blue-700 text-white rounded-2xl p-6 mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black mb-1">
              Tu Blueprint está listo 🎉
            </h1>
            <p className="text-white/80 text-sm">
              {answers.project_name || 'Tu proyecto'} · Generado con IA · Acceso permanente
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleCopyBlueprint}
              className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
            >
              📋 Copiar todo
            </button>
            <button
              onClick={() => window.print()}
              className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
            >
              📄 Guardar PDF
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'blueprint' ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600 hover:border-primary'}`}
          >
            📄 Blueprint
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'chat' ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-600 hover:border-primary'}`}
          >
            💬 Chat con IA
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'chat' ? 'bg-white/20' : 'bg-gray-100 dark:bg-slate-700'}`}>
              {50 - messageCount} left
            </span>
          </button>
        </div>

        {/* Blueprint tab */}
        {activeTab === 'blueprint' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8">
            <BlueprintMarkdown content={blueprint} />
          </div>
        )}

        {/* Chat tab */}
        {activeTab === 'chat' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">

            {/* Chat messages */}
            <div className="h-[500px] overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mr-3 mt-1">
                      IA
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-tr-sm'
                      : 'bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-200 rounded-tl-sm'
                  }`}>
                    {msg.role === 'ai' ? <ChatMarkdown content={msg.content} /> : msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mr-3">
                    IA
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Limit warning */}
            {messageCount >= 40 && messageCount < 50 && (
              <div className="mx-6 mb-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-xl px-4 py-2 text-xs text-yellow-800 dark:text-yellow-300">
                ⚠️ Te quedan {50 - messageCount} mensajes. Cuando se agoten podés coordinar una sesión con Santiago.
              </div>
            )}

            {/* Input */}
            <div className="border-t border-gray-100 dark:border-slate-700 p-4">
              {messageCount >= 50 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500 dark:text-slate-400 text-sm mb-3">
                    Agotaste tus 50 mensajes incluidos.
                  </p>
                  <a
                    href={CONTACT_WHATSAPP}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    💬 Hablar con Santiago →
                  </a>
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="Preguntame sobre tu proyecto, tu stack, cualquier duda..."
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary transition-all text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || chatLoading}
                    className="bg-primary text-white px-5 py-3 rounded-xl font-medium hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 1:1 CTA */}
        <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-600 p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">¿Querés hablar con un humano?</h3>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Coordiná tu sesión 1:1 de 30 minutos incluida en el Blueprint.
            </p>
          </div>
          <a
            href={CONTACT_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm flex items-center gap-2 flex-shrink-0"
          >
            💬 Hablar con Santiago
          </a>
        </div>

      </div>
    </div>
  );
}
