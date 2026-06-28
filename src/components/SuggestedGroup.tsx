import { motion } from 'framer-motion';
import { Users, ArrowRight } from 'lucide-react';

interface SuggestedGroupProps {
  group: {
    name: string;
    emoji: string;
    members: number;
    description: string;
  };
  index: number;
}

export default function SuggestedGroup({ group, index }: SuggestedGroupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -3, scale: 1.01 }}
      className="group min-w-[240px] rounded-2xl liquid-glass p-5 flex flex-col gap-3 cursor-pointer transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{group.emoji}</span>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity liquid-glass rounded-full px-3 py-1 text-[10px] text-foreground">
          Join
        </button>
      </div>
      <div>
        <h4 className="text-sm font-medium text-foreground">{group.name}</h4>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{group.description}</p>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Users className="w-3 h-3" />
        <span>{group.members} members</span>
      </div>
    </motion.div>
  );
}
