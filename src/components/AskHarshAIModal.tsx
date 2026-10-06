import React, { useState } from 'react';
import { X, Sparkles, Send, Loader2, Bot, User, Copy, Check, MessageSquare } from 'lucide-react';
import { api } from '../lib/api.ts';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const AskHarshAIModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  welcomeMessage?: string;
}> = ({ isOpen, onClose, welcomeMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text:
        welcomeMessage ||
        'Hello! I am Ask Harsh AI, the official verified personal assistant for Harsh Raj (HARSHZYNX). How can I assist you today regarding Harsh’s skills, projects, Android development, or engineering goals?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'What are Harsh’s core skills?',
    'Tell me about the Radha Jap Android app',
    'Is Harsh open for engineering opportunities?',
    'What degree is Harsh pursuing?',
  ];

  const handleSend = async (questionText: string) => {
    const q = questionText.trim();
    if (!q || loading) return;

    const userMsg: Message = {
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.askAI(q);
      const aiMsg: Message = {
        sender: 'ai',
        text: res.answer,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        sender: 'ai',
        text: 'Sorry, I encountered an issue retrieving verified portfolio information. Please try again shortly.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[580px] text-slate-100">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-950/80 border border-blue-800/60 text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>Ask Harsh AI</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-950 border border-blue-800 text-blue-300">
                  Grounded
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Answers strictly from verified HARSHZYNX portfolio data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 border border-slate-700 text-blue-400'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-950 border border-slate-800/80 text-slate-200'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <div
                  className={`flex items-center justify-between gap-2 mt-2 pt-1 border-t text-[10px] font-mono ${
                    m.sender === 'user' ? 'border-blue-500 text-blue-200' : 'border-slate-800 text-slate-500'
                  }`}
                >
                  <span>{m.time}</span>
                  {m.sender === 'ai' && (
                    <button
                      onClick={() => copyToClipboard(m.text, idx)}
                      className="hover:text-slate-300 flex items-center gap-1"
                    >
                      {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-blue-400 p-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Consulting verified HARSHZYNX records...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length <= 3 && (
          <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40 flex flex-wrap gap-1.5">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSend(qp)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                {qp}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about projects, Android apps, skills, education..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs sm:text-sm text-white outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
