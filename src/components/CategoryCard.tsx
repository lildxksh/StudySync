import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface CategoryCardProps {
  category: {
    name: string;
    icon: React.ReactNode;
    roomsAvailable: number;
  };
  index: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group relative min-w-[160px] rounded-2xl liquid-glass p-5 flex flex-col gap-3 cursor-pointer transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/60">
          {category.icon}
        </div>
        <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div>
        <h4 className="text-sm font-medium text-foreground">{category.name}</h4>
        <p className="text-xs text-muted-foreground mt-0.5">{category.roomsAvailable} rooms</p>
      </div>
    </motion.div>
  );
}
