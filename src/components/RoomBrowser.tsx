import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Users,
  Clock,
  Volume2,
  Lock,
  Globe,
  Plus,
  Search,
  ArrowRight,
} from 'lucide-react';

interface Room {
  id: string;
  name: string;
  topic: string;
  participants: number;
  maxParticipants: number;
  isPrivate: boolean;
  hasPomodoro: boolean;
  tags: string[];
}

const MOCK_ROOMS: Room[] = [
  {
    id: 'deep-focus-01',
    name: 'Deep Focus Session',
    topic: 'Computer Science',
    participants: 12,
    maxParticipants: 20,
    isPrivate: false,
    hasPomodoro: true,
    tags: ['Pomodoro', 'CS', 'Undergrad'],
  },
  {
    id: 'med-school-grind',
    name: 'Med School Grind',
    topic: 'Medicine',
    participants: 8,
    maxParticipants: 15,
    isPrivate: false,
    hasPomodoro: true,
    tags: ['Pomodoro', 'Medicine', 'Grad'],
  },
  {
    id: 'law-library-vibes',
    name: 'Law Library Vibes',
    topic: 'Law',
    participants: 5,
    maxParticipants: 10,
    isPrivate: true,
    hasPomodoro: false,
    tags: ['Law', 'Quiet', 'Grad'],
  },
  {
    id: 'math-olympiad-prep',
    name: 'Math Olympiad Prep',
    topic: 'Mathematics',
    participants: 18,
    maxParticipants: 25,
    isPrivate: false,
    hasPomodoro: true,
    tags: ['Math', 'Competition', 'HS'],
  },
  {
    id: 'creative-writing',
    name: 'Creative Writing Hour',
    topic: 'Literature',
    participants: 6,
    maxParticipants: 12,
    isPrivate: false,
    hasPomodoro: false,
    tags: ['Writing', 'Quiet', 'Any'],
  },
  {
    id: 'phd-candidates',
    name: 'PhD Candidates Only',
    topic: 'Research',
    participants: 4,
    maxParticipants: 8,
    isPrivate: true,
    hasPomodoro: true,
    tags: ['Research', 'PhD', 'Quiet'],
  },
];

interface RoomBrowserProps {
  onJoinRoom: (roomId: string, userName: string) => void;
}

export default function RoomBrowser({ onJoinRoom }: RoomBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomTopic, setNewRoomTopic] = useState('');
  const [joinName, setJoinName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);

  const allTags = Array.from(new Set(MOCK_ROOMS.flatMap((r) => r.tags)));

  const filteredRooms = MOCK_ROOMS.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? room.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim() && joinName.trim()) {
      const roomId = newRoomName.toLowerCase().replace(/\s+/g, '-');
      onJoinRoom(roomId, joinName.trim());
    }
  };

  const handleJoinRoom = (roomId: string) => {
    setJoinRoomId(roomId);
    setShowJoinModal(true);
  };

  const confirmJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinName.trim()) {
      onJoinRoom(joinRoomId, joinName.trim());
    }
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2
            className="font-display text-4xl md:text-5xl text-foreground mb-2"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Explore Study Rooms
          </h2>
          <p className="text-muted-foreground">
            Join a room and start studying with students from around the world.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="liquid-glass rounded-full px-6 py-3 text-sm flex items-center gap-2 hover:scale-[1.03] transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          Create Room
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search rooms by name or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border border-border/30 rounded-full pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedTag(null)}
          className={cn(
            'px-4 py-1.5 rounded-full text-xs transition-all',
            selectedTag === null
              ? 'bg-foreground text-background'
              : 'border border-border/30 text-muted-foreground hover:text-foreground'
          )}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
            className={cn(
              'px-4 py-1.5 rounded-full text-xs transition-all',
              selectedTag === tag
                ? 'bg-foreground text-background'
                : 'border border-border/30 text-muted-foreground hover:text-foreground'
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="group relative p-6 rounded-2xl liquid-glass hover:scale-[1.01] transition-all cursor-pointer"
            onClick={() => handleJoinRoom(room.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {room.isPrivate ? (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Globe className="w-4 h-4 text-emerald-400" />
                )}
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                  {room.topic}
                </span>
              </div>
              {room.hasPomodoro && (
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <Clock className="w-3 h-3" />
                  <span>Pomodoro</span>
                </div>
              )}
            </div>

            <h3
              className="font-display text-2xl text-foreground mb-3"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {room.name}
            </h3>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>
                  {room.participants}/{room.maxParticipants}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Volume2 className="w-4 h-4" />
                <span>Voice</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {room.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full text-[10px] border border-border/20 text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-5 h-5 text-foreground" />
            </div>
          </div>
        ))}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-8 rounded-3xl liquid-glass">
            <h3
              className="font-display text-2xl text-foreground mb-6"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Create Your Study Room
            </h3>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Your Name</label>
                <input
                  type="text"
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-transparent border border-border/30 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Room Name</label>
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="e.g., Late Night CS Grind"
                  className="w-full bg-transparent border border-border/30 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Topic</label>
                <input
                  type="text"
                  value={newRoomTopic}
                  onChange={(e) => setNewRoomTopic(e.target.value)}
                  placeholder="e.g., Computer Science"
                  className="w-full bg-transparent border border-border/30 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 rounded-full border border-border/30 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full liquid-glass text-sm hover:scale-[1.03] transition-all"
                >
                  Create & Join
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-8 rounded-3xl liquid-glass">
            <h3
              className="font-display text-2xl text-foreground mb-2"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Join Room
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Enter your name to join <span className="text-foreground">{joinRoomId}</span>
            </p>
            <form onSubmit={confirmJoin} className="space-y-4">
              <input
                type="text"
                value={joinName}
                onChange={(e) => setJoinName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-transparent border border-border/30 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
                required
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 py-3 rounded-full border border-border/30 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full liquid-glass text-sm hover:scale-[1.03] transition-all"
                >
                  Join Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
