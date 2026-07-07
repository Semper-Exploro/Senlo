import type { Resonance } from '../../data/mock';
import { useStore } from '../../hooks/useStore';

interface ResonanceBarProps {
  resonances: Resonance[];
  postId?: string;
  readonly?: boolean;
}

export function ResonanceBar({ resonances, postId, readonly = false }: ResonanceBarProps) {
  const addResonance = useStore((state) => state.addResonance);

  const handleClick = (type: string) => {
    if (readonly || !postId) return;
    addResonance(postId, type);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {resonances.map((resonance) => (
        <button
          key={resonance.type}
          onClick={() => handleClick(resonance.type)}
          disabled={readonly}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] transition-all ${
            readonly
              ? 'bg-gray-50 text-gray-600 cursor-default'
              : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:scale-105'
          }`}
        >
          <span>{resonance.emoji}</span>
          <span>{resonance.label}</span>
          <span className="text-gray-400">{resonance.count}</span>
        </button>
      ))}
    </div>
  );
}
