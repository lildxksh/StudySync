import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onExplore: () => void;
  onHome: () => void;
  currentView: 'home' | 'explore' | 'rooms' | 'room';
}

const navLinks = [
  { label: 'Home', view: 'home' as const },
  { label: 'Explore', view: 'explore' as const },
  { label: 'My Rooms', view: 'rooms' as const },
  { label: 'Friends', view: null },
]

export default function Navbar({ onExplore, onHome, currentView }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (view: string | null) => {
    if (view === 'home') onHome();
    if (view === 'explore') onExplore();
    if (view === 'rooms') onExplore(); // My Rooms goes to explore for now
    setMobileOpen(false);
  }

  return (
    <nav className="relative z-10">
      <div className="flex justify-between items-center px-6 md:px-8 py-6 max-w-7xl mx-auto">
        {/* Logo */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onHome(); }}
          className="font-display text-3xl tracking-tight text-white"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          StudySync<sup className="text-xs">®</sup>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.view);
              }}
              className={cn(
                'text-sm transition-colors cursor-pointer',
                link.view === currentView
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notification */}
          <button className="relative p-2 rounded-full liquid-glass hover:scale-[1.05] transition-all">
            <Bell className="w-4 h-4 text-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full" />
          </button>

          {/* Profile Avatar */}
          <button className="w-9 h-9 rounded-full liquid-glass flex items-center justify-center hover:scale-[1.05] transition-all">
            <User className="w-4 h-4 text-foreground" />
          </button>

          {/* Create Room Button (desktop) */}
          <button
            onClick={onExplore}
            className="hidden md:block liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground hover:scale-[1.03] transition-all cursor-pointer"
          >
            Create Room
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full liquid-glass"
          >
            {mobileOpen ? (
              <X className="w-4 h-4 text-foreground" />
            ) : (
              <Menu className="w-4 h-4 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden px-6 pb-6"
          >
            <div className="rounded-2xl liquid-glass p-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.view);
                  }}
                  className={cn(
                    'block px-4 py-2.5 rounded-xl text-sm transition-colors',
                    link.view === currentView
                      ? 'text-foreground bg-foreground/5'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={onExplore}
                className="w-full mt-2 liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground hover:scale-[1.03] transition-all"
              >
                Create Room
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
