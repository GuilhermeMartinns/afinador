import React, { useState } from 'react';

interface TheoryInsightProps {
  chordKey?: string;
  chordSuffix?: string;
  isFlatNote?: boolean;
}

export const TheoryInsight: React.FC<TheoryInsightProps> = ({
  chordKey = 'C',
  chordSuffix = 'M',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'funcao' | 'cadencia' | 'curiosidade'>('funcao');

  // Identificar categoria teórica do acorde
  const isDominant = chordSuffix.includes('7') && !chordSuffix.includes('7M') && !chordSuffix.includes('m7');
  const isMajor7 = chordSuffix.includes('7M');
  const isMinor = chordSuffix.startsWith('m') && !chordSuffix.includes('7M');
  const isDiminished = chordSuffix.includes('°') || chordSuffix.includes('dim') || chordSuffix.includes('m7(b5)');

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden transition-all mt-2">
      {/* Botão de Toggle Retrátil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-white/[0.04] transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center text-xs font-serif font-bold">
            i
          </span>
          <span className="text-xs font-semibold text-gray-200">
            Entenda a Teoria Harmônica deste Acorde
          </span>
          <span className="text-[10px] text-emerald-400 font-mono px-2 py-0.5 rounded-full bg-emerald-500/10">
            Dica Prática
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <span>{isOpen ? 'Ocultar' : 'Expandir'}</span>
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {/* Conteúdo Expansível */}
      {isOpen && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-white/[0.06] flex flex-col gap-2.5">
          {/* Abas Internas */}
          <div className="flex items-center gap-1.5 pt-2">
            <button
              onClick={() => setActiveTab('funcao')}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                activeTab === 'funcao'
                  ? 'bg-white text-gray-950 font-bold'
                  : 'bg-white/[0.05] text-gray-400 hover:text-white'
              }`}
            >
              Função Tonal
            </button>
            <button
              onClick={() => setActiveTab('cadencia')}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                activeTab === 'cadencia'
                  ? 'bg-white text-gray-950 font-bold'
                  : 'bg-white/[0.05] text-gray-400 hover:text-white'
              }`}
            >
              O Famoso 2-5-1
            </button>
            <button
              onClick={() => setActiveTab('curiosidade')}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                activeTab === 'curiosidade'
                  ? 'bg-white text-gray-950 font-bold'
                  : 'bg-white/[0.05] text-gray-400 hover:text-white'
              }`}
            >
              Notas-Guia
            </button>
          </div>

          {/* Tab 1: Função Tonal do Acorde */}
          {activeTab === 'funcao' && (
            <div className="bg-gray-950/50 rounded-xl p-3 border border-white/[0.04] text-xs text-gray-300 leading-relaxed flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Papel Harmônico:</span>
                {isDominant ? (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-semibold text-[10px]">
                    Dominante (Tensão Máxima)
                  </span>
                ) : isMinor ? (
                  <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 font-semibold text-[10px]">
                    Subdominante / Relativo Menor
                  </span>
                ) : isDiminished ? (
                  <span className="px-2 py-0.5 rounded-md bg-red-500/20 text-red-300 font-semibold text-[10px]">
                    Tensão Sensível / Trítono
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-semibold text-[10px]">
                    Tônica (Repouso e Estabilidade)
                  </span>
                )}
              </div>

              {isDominant && (
                <p>
                  Acordes dominantes (com 7ª menor) possuem o <strong>trítono</strong> (intervalo tenso de 3 tons inteiros entre a 3ª maior e a 7ª menor). É essa instabilidade natural que cria a irresistível vontade do ouvido de resolver na <strong>Tônica</strong> (repouso uma quarta acima ou quinta abaixo).
                </p>
              )}

              {isMinor && (
                <p>
                  Acordes menores trazem uma coloração mais emotiva ou reflexiva devido à <strong>terça menor</strong> (distância de 1 tom e meio da raiz). No campo harmônico maior, preparam a subida de tensão para o acorde dominante.
                </p>
              )}

              {isMajor7 && (
                <p>
                  A <strong>sétima maior (7M)</strong> adiciona sofisticação e suavidade. Ao contrário da 7ª menor (que gera tensão imediata para resolver), a 7ª maior é um acorde de repouso nobre e sonhador, muito presente na Bossa Nova e MPB.
                </p>
              )}

              {isDiminished && (
                <p>
                  Acordes diminutos e meio-diminutos são altamente tensionados. Funcionam como pontes de passagem cromática ou como o <strong>acorde ii</strong> no ciclo 2-5-1 menor.
                </p>
              )}

              {!isDominant && !isMinor && !isMajor7 && !isDiminished && (
                <p>
                  A tríade maior natural transmite sensação de plenitude, brilho e conclusão. É o porto seguro para onde a maioria das músicas da harmonia funcional retorna ao final de uma frase musical.
                </p>
              )}
            </div>
          )}

          {/* Tab 2: O 2-5-1 na Prática */}
          {activeTab === 'cadencia' && (
            <div className="bg-gray-950/50 rounded-xl p-3 border border-white/[0.04] text-xs text-gray-300 leading-relaxed flex flex-col gap-2">
              <h4 className="font-bold text-white text-[12px] flex items-center gap-1.5">
                <span>🔄 O Que É o Famoso ii - V - I?</span>
              </h4>
              <p>
                É a sequência de acordes mais importante da música ocidental. Ela organiza a passagem perfeita de <strong>Preparação (ii)</strong> $\rightarrow$ <strong>Tensão (V)</strong> $\rightarrow$ <strong>Resolução (I)</strong>:
              </p>
              <div className="grid grid-cols-3 gap-2 text-center my-1">
                <div className="p-2 rounded-lg bg-sky-950/30 border border-sky-800/40">
                  <div className="text-[10px] text-sky-400 font-bold uppercase">ii (2º Grau)</div>
                  <div className="text-white font-mono font-bold mt-0.5">Movimento</div>
                  <div className="text-[10px] text-gray-400">Subdominante</div>
                </div>
                <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-800/40">
                  <div className="text-[10px] text-amber-400 font-bold uppercase">V (5º Grau)</div>
                  <div className="text-white font-mono font-bold mt-0.5">Tensão</div>
                  <div className="text-[10px] text-gray-400">Dominante</div>
                </div>
                <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40">
                  <div className="text-[10px] text-emerald-400 font-bold uppercase">I (1º Grau)</div>
                  <div className="text-white font-mono font-bold mt-0.5">Repouso</div>
                  <div className="text-[10px] text-gray-400">Tônica Final</div>
                </div>
              </div>
              <p className="text-gray-400 text-[11px]">
                💡 <em>Dica de Ouro:</em> Se você estiver tocando no tom de <strong>{chordKey}</strong>, o 2-5-1 é o caminho mais natural para compor e modular com fluidez.
              </p>
            </div>
          )}

          {/* Tab 3: Dica de Vozes e Condução */}
          {activeTab === 'curiosidade' && (
            <div className="bg-gray-950/50 rounded-xl p-3 border border-white/[0.04] text-xs text-gray-300 leading-relaxed flex flex-col gap-2">
              <h4 className="font-bold text-white text-[12px]">✨ Notas-Guia (Terça e Sétima)</h4>
              <p>
                As duas notas mais importantes de qualquer acorde são a <strong>3ª</strong> (que define se é maior ou menor) e a <strong>7ª</strong> (que define a função harmônica de tensão ou repouso).
              </p>
              <p className="text-gray-400 text-[11px]">
                Ao encadear acordes, a 7ª do acorde anterior costuma descer apenas meio tom para se transformar na 3ª do próximo acorde, criando a condução de vozes mais suave da música!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TheoryInsight;

