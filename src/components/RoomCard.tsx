import { motion } from 'framer-motion';
import { Volume2, Clock, BookOpen, Globe, Users, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomCardProps {
  room: {
    id: string;
    title: string;
    description: string;
    membersOnline: number;
    maxMembers: number;
    type: 'Voice' | 'Silent';
    timeRemaining: string;
    topic: string;
    language: string;
    difficulty: string;
    participants: string[];
    isLive: boolean;
  };
  index: number;
  onJoin: (roomId: string) => void;
}

export default function RoomCard({ room, index, onJoin }: RoomCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative rounded-3xl liquid-glass p-6 flex flex-col gap-4 cursor-pointer transition-all duration-300"
    >
      {/* Top Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {room.isLive && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
          )}
          <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-medium">
            {room.isLive ? 'LIVE' : 'UPCOMING'}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {room.membersOnline} / {room.maxMembers}
        </span>
      </div>

      {/* Title */}
      <h3
        className="font-display text-2xl text-foreground leading-tight"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        {room.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
        {room.description}
      </p>

      {/* Info Row */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Volume2 className="w-3.5 h-3.5" />
          <span>{room.type}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span>{room.timeRemaining}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{room.topic}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Globe className="w-3.5 h-3.5" />
          <span>{room.language}</span>
        </div>
      </div>

      {/* Difficulty Badge */}
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'px-2.5 py-1 rounded-full text-[10px] border',
            room.difficulty === 'Beginner'
              ? 'border-emerald-500/30 text-emerald-400'
              : room.difficulty === 'Intermediate'
              ? 'border-amber-500/30 text-amber-400'
              : 'border-red-500/30 text-red-400'
          )}
        >
          {room.difficulty}
        </span>
      </div>

      {/* Participants */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {room.participants.slice(0, 5).map((initial, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-foreground/10 border border-background flex items-center justify-center text-[10px] text-foreground font-medium"
              >
                {initial}
              </div>
            ))}
          </div>
          {room.membersOnline > 5 && (
            <span className="ml-3 text-xs text-muted-foreground">
              +{room.membersOnline - 5}
            </span>
          )}
        </div>
      </div>

      {/* Join Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onJoin(room.id);
        }}
        className="w-full liquid-glass rounded-full py-3 text-sm text-foreground flex items-center justify-center gap-2 hover:scale-[1.03] transition-all group/btn mt-2"
      >
        <span>Join Room</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
      </button>
    </motion.div>
  );
}
