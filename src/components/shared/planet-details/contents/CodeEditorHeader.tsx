import { PROGRAMMING_LANGUAGE } from '@/lib/constants/planet';
import { cn } from '@/lib/utils/cn';
import { ProgrammingLanguage } from '@/types/planet';
import { Moon, Sun } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  editMode: boolean;
  setEditMode: Dispatch<SetStateAction<boolean>>;
  lightMode: boolean;
  setLightMode: Dispatch<SetStateAction<boolean>>;
  language: ProgrammingLanguage;
}

const CodeEditorHeader = ({
  editMode,
  setEditMode,
  lightMode,
  setLightMode,
  language,
}: Props) => {
  return (
    <div
      className={cn(
        'px-4 py-2 flex justify-between items-center border-b transition-colors duration-200',
        lightMode
          ? 'bg-slate-100 border-slate-200 text-slate-800'
          : 'bg-[#12171f] border-[#30363d] text-[#c9d1d9]',
      )}
    >
      <div
        className={cn(
          'text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-md border',
          lightMode
            ? 'bg-white border-slate-300 text-slate-600 shadow-sm'
            : 'bg-white/5 border-white/10 text-slate-400',
        )}
      >
        {PROGRAMMING_LANGUAGE[language]}
      </div>

      <div className="flex items-center gap-4">
        {/* <button
          onClick={() => setEditMode(p => !p)}
          className={cn(
            'text-sm font-medium px-4 py-1.5 rounded-lg transition-all border',
            lightMode
              ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300',
          )}
        >
          {editMode ? 'Stop editing' : 'Edit Code'}
        </button> */}

        <button
          onClick={() => setLightMode(p => !p)}
          className={cn(
            'p-2 rounded-full border transition-all flex items-center justify-center',
            lightMode
              ? 'bg-white border-slate-300 text-amber-500 shadow-sm hover:bg-slate-50'
              : 'bg-[#161b22] border-white/10 text-blue-400 hover:bg-[#1c2128] hover:border-white/20',
          )}
        >
          {lightMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </div>
  );
};

export default CodeEditorHeader;
