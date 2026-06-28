import { cn } from '@/lib/utils'

interface HeroProps {
  onJoinRoom: () => void;
}

const stats = [
  { value: '50K+', label: 'Students studying daily' },
  { value: '2M+', label: 'Focus hours completed' },
  { value: '8,000+', label: 'Active voice rooms' },
]

export default function Hero({ onJoinRoom }: HeroProps) {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 pb-40">
      <h1
        className="animate-fade-rise font-display text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal"
        style={{ fontFamily: "'Instrument Serif', serif" }}
      >
        Study smarter,{' '}
        <em className="not-italic text-muted-foreground">together</em> —{' '}
        <em className="not-italic text-muted-foreground">
          one voice room at a time.
        </em>
      </h1>

      <p className="animate-fade-rise-delay text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed">
        Join students from around the world in distraction-free voice study
        rooms. Find accountability partners, build consistent study habits,
        and stay focused with live Pomodoro sessions designed for deep work.
      </p>

      <button
        onClick={onJoinRoom}
        className="animate-fade-rise-delay-2 liquid-glass rounded-full px-14 py-5 text-base mt-12 cursor-pointer hover:scale-[1.03] transition-all text-foreground"
      >
        Join a Study Room
      </button>

      <button
        onClick={onJoinRoom}
        className="mt-5 text-muted-foreground hover:text-foreground transition-colors text-sm cursor-pointer bg-transparent border-none"
      >
        Create Your Own Room
      </button>

      {/* Stats */}
      <div className="flex gap-10 mt-16 text-center flex-wrap justify-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p
              className="font-display text-4xl sm:text-5xl text-foreground"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {stat.value}
            </p>
            <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
