import { motion } from 'framer-motion';
import { ArrowRight, Users, Clock, Zap } from 'lucide-react';

interface FeaturedRoomProps {
  room: {
    id: string;
    title: string;
    subtitle: string;
    members: number;
    duration: string;
    color: string;
  };
  index: number;
  onJoin: (roomId: string) => void;
}

export default function FeaturedRoom({ room, index, onJoin }: FeaturedRoomProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative min-w-[320px] md:min-w-[380px] rounded-3xl liquid-glass p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] uppercase tracking-widest text-amber-400 font-medium">Featured</span>
        </div>
        <span className="text-xs text-muted-foreground">{room.members} studying</span>
      </div>

      <div>
        <h3
          className="font-display text-3xl text-foreground leading-tight mb-1"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          {room.title}
        </h3>
        <p className="text-sm text-muted-foreground">{room.subtitle}</p>
      </div>

      <div className="flex items-center gap-4 mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>{room.duration}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="w-3.5 h-3.5" />
          <span>{room.members} online</span>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onJoin(room.id);
        }}
        className="mt-2 w-full liquid-glass rounded-full py-3 text-sm text-foreground flex items-center justify-center gap-2 hover:scale-[1.03] transition-all group/btn"
      >
        <span>Join Now</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
      </button>
    </motion.div>
  );
}
