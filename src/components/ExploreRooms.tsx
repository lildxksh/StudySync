import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, ArrowRight, Code, Cloud, Brain, BookOpen, Globe, Server, Terminal, GraduationCap, FlaskConical, Languages, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import SearchBar from './SearchBar';
import FilterChips from './FilterChips';
import RoomCard from './RoomCard';
import FeaturedRoom from './FeaturedRoom';
import CategoryCard from './CategoryCard';
import StatsSidebar from './StatsSidebar';
import SuggestedGroup from './SuggestedGroup';
import FloatingCreateButton from './FloatingCreateButton';

// ─── Data ───────────────────────────────────────────────────────────

const FEATURED_ROOMS = [
  { id: 'dsa-sprint', title: 'DSA Sprint', subtitle: 'Binary Trees, Graphs, DP — daily grind', members: 24, duration: '2h remaining' },
  { id: 'react-interview', title: 'React Interview Prep', subtitle: 'Hooks, Patterns, Performance', members: 18, duration: '1.5h remaining' },
  { id: 'aws-bootcamp', title: 'AWS Cloud Bootcamp', subtitle: 'S3, EC2, Lambda, CloudFormation', members: 31, duration: '3h remaining' },
  { id: 'upsc-evening', title: 'UPSC Evening Session', subtitle: 'Polity & Current Affairs', members: 42, duration: '1h remaining' },
  { id: 'leetcode-daily', title: 'LeetCode Daily Grind', subtitle: 'Top 150 problems, blind 75', members: 56, duration: '4h remaining' },
  { id: 'system-design', title: 'System Design Masterclass', subtitle: 'Design WhatsApp, Netflix, Uber', members: 12, duration: '2.5h remaining' },
];

const LIVE_ROOMS = [
  { id: 'focused-dsa', title: 'Focused DSA Session', description: 'Solving Binary Trees and Graph questions with whiteboard explanations.', membersOnline: 8, maxMembers: 10, type: 'Voice' as const, timeRemaining: '32 mins', topic: 'Binary Trees', language: 'English', difficulty: 'Intermediate', participants: ['A', 'R', 'S', 'M', 'K'], isLive: true },
  { id: 'react-patterns', title: 'React Patterns Deep Dive', description: 'Advanced hooks, compound components, and render props patterns.', membersOnline: 12, maxMembers: 15, type: 'Voice' as const, timeRemaining: '45 mins', topic: 'React', language: 'English', difficulty: 'Advanced', participants: ['J', 'L', 'T', 'P'], isLive: true },
  { id: 'silent-jee', title: 'Silent JEE Physics', description: 'Quiet study session for JEE Physics — cameras off, focus on.', membersOnline: 6, maxMembers: 20, type: 'Silent' as const, timeRemaining: '1h 20m', topic: 'Physics', language: 'Hindi', difficulty: 'Advanced', participants: ['V', 'N', 'D'], isLive: true },
  { id: 'python-ai', title: 'Python for AI & ML', description: 'NumPy, Pandas, and building neural networks from scratch.', membersOnline: 15, maxMembers: 25, type: 'Voice' as const, timeRemaining: '1h 10m', topic: 'Python', language: 'English', difficulty: 'Beginner', participants: ['E', 'F', 'G', 'H', 'I'], isLive: true },
  { id: 'upsc-history', title: 'UPSC Modern History', description: 'Freedom struggle, Congress sessions, and post-independence India.', membersOnline: 22, maxMembers: 30, type: 'Voice' as const, timeRemaining: '55 mins', topic: 'History', language: 'English', difficulty: 'Intermediate', participants: ['Q', 'W', 'R', 'Y'], isLive: true },
  { id: 'cloud-devops', title: 'Cloud & DevOps', description: 'Docker, Kubernetes, CI/CD pipelines, and infrastructure as code.', membersOnline: 9, maxMembers: 15, type: 'Voice' as const, timeRemaining: '2h', topic: 'DevOps', language: 'English', difficulty: 'Intermediate', participants: ['Z', 'X', 'C'], isLive: true },
  { id: 'neet-biology', title: 'NEET Biology Marathon', description: 'Human physiology, genetics, and ecology revision.', membersOnline: 18, maxMembers: 25, type: 'Voice' as const, timeRemaining: '1h 45m', topic: 'Biology', language: 'English', difficulty: 'Intermediate', participants: ['B', 'N', 'M', 'V'], isLive: true },
  { id: 'system-design-2', title: 'System Design Interview', description: 'Designing scalable systems — load balancers, databases, caching.', membersOnline: 7, maxMembers: 12, type: 'Voice' as const, timeRemaining: '1h 30m', topic: 'System Design', language: 'English', difficulty: 'Advanced', participants: ['O', 'P', 'S'], isLive: true },
  { id: 'language-japanese', title: 'Japanese N3 Prep', description: 'Kanji, grammar, and listening practice for JLPT N3.', membersOnline: 5, maxMembers: 10, type: 'Voice' as const, timeRemaining: '50 mins', topic: 'Japanese', language: 'Japanese', difficulty: 'Intermediate', participants: ['K', 'L'], isLive: true },
];

const CATEGORIES = [
  { name: 'Web Development', icon: <Code className="w-5 h-5" />, roomsAvailable: 24 },
  { name: 'Java', icon: <Terminal className="w-5 h-5" />, roomsAvailable: 18 },
  { name: 'Python', icon: <Terminal className="w-5 h-5" />, roomsAvailable: 32 },
  { name: 'AI & ML', icon: <Brain className="w-5 h-5" />, roomsAvailable: 15 },
  { name: 'Cloud', icon: <Cloud className="w-5 h-5" />, roomsAvailable: 12 },
  { name: 'System Design', icon: <Layers className="w-5 h-5" />, roomsAvailable: 9 },
  { name: 'DevOps', icon: <Server className="w-5 h-5" />, roomsAvailable: 11 },
  { name: 'Competitive Programming', icon: <Terminal className="w-5 h-5" />, roomsAvailable: 28 },
  { name: 'College Exams', icon: <GraduationCap className="w-5 h-5" />, roomsAvailable: 45 },
  { name: 'UPSC', icon: <BookOpen className="w-5 h-5" />, roomsAvailable: 22 },
  { name: 'JEE', icon: <FlaskConical className="w-5 h-5" />, roomsAvailable: 19 },
  { name: 'NEET', icon: <FlaskConical className="w-5 h-5" />, roomsAvailable: 16 },
  { name: 'Language Learning', icon: <Globe className="w-5 h-5" />, roomsAvailable: 8 },
];

const SUGGESTED_GROUPS = [
  { name: 'Night Owls', emoji: '🌙', members: 1243, description: 'Study after midnight. Peak focus hours.' },
  { name: 'Placement Warriors', emoji: '⚔️', members: 892, description: 'Cracking FAANG and top product companies.' },
  { name: 'React Builders', emoji: '⚛️', members: 567, description: 'Building production-grade React apps.' },
  { name: 'SRM CSE Community', emoji: '🎓', members: 2104, description: 'SRM University CSE students unite.' },
  { name: 'AWS Beginners', emoji: '☁️', members: 445, description: 'From zero to cloud certified.' },
  { name: 'Open Source Club', emoji: '🌿', members: 678, description: 'Contributing to OSS and building portfolios.' },
];

// ─── Component ──────────────────────────────────────────────────────

interface ExploreRoomsProps {
  onJoinRoom: (roomId: string) => void;
  onCreateRoom: () => void;
}

export default function ExploreRooms({ onJoinRoom, onCreateRoom }: ExploreRoomsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredRooms = useMemo(() => {
    return LIVE_ROOMS.filter((room) => {
      const matchesSearch =
        room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.topic.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        activeFilter === 'All' ||
        (activeFilter === 'Voice' && room.type === 'Voice') ||
        (activeFilter === 'Silent Study' && room.type === 'Silent') ||
        (activeFilter === 'Programming' && ['React', 'Python', 'DevOps', 'System Design', 'Binary Trees'].includes(room.topic)) ||
        (activeFilter === 'Beginner' && room.difficulty === 'Beginner') ||
        (activeFilter === 'Intermediate' && room.difficulty === 'Intermediate') ||
        (activeFilter === 'Advanced' && room.difficulty === 'Advanced') ||
        (activeFilter === 'Public' && !room.id.includes('private')) ||
        (activeFilter === 'Private' && room.id.includes('private')) ||
        room.topic.includes(activeFilter) ||
        room.tags?.includes(activeFilter);

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative z-10 min-h-screen pb-20"
    >
      {/* Background Video */}
      <video
        className="fixed inset-0 w-full h-full object-cover z-0"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <h1
            className="font-display text-5xl md:text-6xl text-foreground mb-4"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Explore Live Study Rooms
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Discover productive voice rooms, find accountability partners, and join students studying in real time.
          </p>
        </motion.div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        {/* Filters */}
        <div className="mb-10">
          <FilterChips activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

        {/* Main Content Grid */}
        <div className="flex gap-8">
          {/* Left Content */}
          <div className="flex-1 min-w-0">
            {/* Featured Rooms */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mb-10"
            >
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
                Featured
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {FEATURED_ROOMS.map((room, i) => (
                  <div key={room.id} className="snap-start">
                    <FeaturedRoom room={room} index={i} onJoin={onJoinRoom} />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-10"
            >
              <h2
                className="font-display text-2xl text-foreground mb-4"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Browse by Topic
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {CATEGORIES.map((cat, i) => (
                  <div key={cat.name} className="snap-start">
                    <CategoryCard category={cat} index={i} />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Live Rooms Grid */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="font-display text-2xl text-foreground"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Live Rooms
                </h2>
                <span className="text-xs text-muted-foreground">{filteredRooms.length} rooms</span>
              </div>

              <AnimatePresence mode="wait">
                {filteredRooms.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRooms.map((room, i) => (
                      <RoomCard key={room.id} room={room} index={i} onJoin={onJoinRoom} />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="w-16 h-16 rounded-full liquid-glass flex items-center justify-center mb-4">
                      <Search className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg text-foreground mb-2">No matching study rooms</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                      Try changing your filters or create your own room to start studying with others.
                    </p>
                    <button
                      onClick={onCreateRoom}
                      className="liquid-glass rounded-full px-6 py-3 text-sm hover:scale-[1.03] transition-all"
                    >
                      Create Room
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Suggested Groups */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="mt-10"
            >
              <h2
                className="font-display text-2xl text-foreground mb-4"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Suggested Groups
              </h2>
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {SUGGESTED_GROUPS.map((group, i) => (
                  <div key={group.name} className="snap-start">
                    <SuggestedGroup group={group} index={i} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar */}
          <StatsSidebar />
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingCreateButton onClick={onCreateRoom} />
    </motion.div>
  );
}
