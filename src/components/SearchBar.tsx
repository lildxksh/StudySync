import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        className={
          'relative flex items-center rounded-full liquid-glass transition-all duration-300 ' +
          (isFocused ? 'ring-1 ring-foreground/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]' : '')
        }
      >
        <Search className="absolute left-5 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search rooms, subjects, technologies or students..."
          className="w-full bg-transparent rounded-full pl-14 pr-14 py-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button className="absolute right-5 p-1 text-muted-foreground hover:text-foreground transition-colors">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
