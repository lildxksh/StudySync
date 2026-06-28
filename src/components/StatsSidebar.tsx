import { motion } from 'framer-motion';
import { Clock, Flame, Target, Users, Calendar, Quote } from 'lucide-react';

export default function StatsSidebar() {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      className="hidden xl:block w-80 shrink-0"
    >
      <div className="sticky top-8 space-y-4">
        {/* Today's Progress */}
        <div className="rounded-3xl liquid-glass p-6">
          <h3 className="text-sm font-medium text-foreground mb-4">Today's Progress</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Study Time</span>
              </div>
              <span className="text-sm font-medium text-foreground">4h 20m</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Flame className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-muted-foreground">Current Streak</span>
              </div>
              <span className="text-sm font-medium text-foreground">12 Days</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Weekly Goal</span>
              </div>
              <span className="text-sm font-medium text-foreground">18 / 25 hrs</span>
            </div>
            <div className="w-full h-1.5 bg-foreground/5 rounded-full overflow-hidden">
              <div className="h-full w-[72%] bg-foreground/20 rounded-full" />
            </div>
          </div>
        </div>

        {/* Friends Online */}
        <div className="rounded-3xl liquid-glass p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-foreground">Friends Online</h3>
            <span className="text-xs text-emerald-400">8 online</span>
          </div>
          <div className="flex -space-x-2">
            {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((initial, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full bg-foreground/10 border border-background flex items-center justify-center text-[10px] text-foreground font-medium"
              >
                {initial}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Session */}
        <div className="rounded-3xl liquid-glass p-6">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-medium text-foreground">Upcoming Session</h3>
          </div>
          <p className="text-sm text-foreground">System Design Deep Dive</p>
          <p className="text-xs text-muted-foreground mt-1">7:30 PM · 45 mins</p>
        </div>

        {/* Quote */}
        <div className="rounded-3xl liquid-glass p-6">
          <div className="flex items-start gap-3">
            <Quote className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-foreground italic leading-relaxed">
                "Stay consistent. Small steps every day compound into extraordinary results."
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
