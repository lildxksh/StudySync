import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface FloatingCreateButtonProps {
  onClick: () => void;
}

export default function FloatingCreateButton({ onClick }: FloatingCreateButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-8 right-8 z-40 flex items-center gap-3 liquid-glass rounded-full p-4 hover:scale-[1.05] transition-all cursor-pointer"
    >
      <Plus className="w-5 h-5 text-foreground" />
      <motion.span
        initial={false}
        animate={{ width: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
        className="overflow-hidden whitespace-nowrap text-sm text-foreground"
      >
        Create Room
      </motion.span>
    </motion.button>
  );
}
