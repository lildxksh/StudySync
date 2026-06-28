import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const FILTERS = [
  'All',
  'Voice',
  'Silent Study',
  'Pomodoro',
  'Programming',
  'AI',
  'Cloud',
  'UPSC',
  'JEE',
  'NEET',
  'Languages',
  'Beginner',
  'Intermediate',
  'Advanced',
  'Public',
  'Private',
];

interface FilterChipsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterChips({ activeFilter, onFilterChange }: FilterChipsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
    >
      {FILTERS.map((filter, i) => (
        <motion.button
          key={filter}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.02 }}
          onClick={() => onFilterChange(filter)}
          className={cn(
            'shrink-0 px-4 py-2 rounded-full text-xs transition-all duration-200 cursor-pointer',
            activeFilter === filter
              ? 'bg-foreground text-background'
              : 'liquid-glass text-muted-foreground hover:text-foreground'
          )}
        >
          {filter}
        </motion.button>
      ))}
    </motion.div>
  );
}
