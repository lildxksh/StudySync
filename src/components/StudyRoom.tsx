import { useState, useRef, useEffect } from 'react';
import { useWebRTC } from '../hooks/useWebRTC';
import { cn } from '@/lib/utils';
import {
  Mic,
  MicOff,
  PhoneOff,
  Send,
  Users,
  MessageSquare,
  Clock,
  Volume2,
  VolumeX,
  MoreHorizontal,
  ChevronLeft,
} from 'lucide-react';

interface StudyRoomProps {
  roomId: string;
  userName: string;
  onLeave: () => void;
}

export default function StudyRoom({ roomId, userName, onLeave }: StudyRoomProps) {
  const [message, setMessage] = useState('');
  const [showChat, setShowChat] = useState(true);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState<'work' | 'break'>('work');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    participants,
    messages,
    isMuted,
    isConnected,
    typingUsers,
    toggleMute,
    sendMessage,
    sendTyping,
    stopTyping,
    leaveRoom,
  } = useWebRTC(roomId, userName);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Pomodoro timer
  useEffect(() => {
    if (!isPomodoroRunning) return;

    const interval = setInterval(() => {
      setPomodoroTime((prev) => {
        if (prev <= 1) {
          setIsPomodoroRunning(false);
          // Switch modes
          setPomodoroMode((mode) => (mode === 'work' ? 'break' : 'work'));
          return pomodoroMode === 'work' ? 5 * 60 : 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPomodoroRunning, pomodoroMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage(message.trim());
      setMessage('');
      stopTyping();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (e.target.value) {
      sendTyping();
    } else {
      stopTyping();
    }
  };

  const handleLeave = () => {
    leaveRoom();
    onLeave();
  };

  const startPomodoro = () => {
    setIsPomodoroRunning(true);
  };

  const pausePomodoro = () => {
    setIsPomodoroRunning(false);
  };

  const resetPomodoro = () => {
    setIsPomodoroRunning(false);
    setPomodoroTime(pomodoroMode === 'work' ? 25 * 60 : 5 * 60);
  };

  if (!isConnected) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Connecting to room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Room Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/30">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLeave}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm">Leave</span>
          </button>
          <div className="w-px h-6 bg-border" />
          <div>
            <h2 className="font-display text-xl text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>
              {roomId}
            </h2>
            <p className="text-xs text-muted-foreground">{participants.length + 1} participants</p>
          </div>
        </div>

        {/* Pomodoro Timer */}
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full liquid-glass",
            pomodoroMode === 'work' ? 'text-foreground' : 'text-emerald-400'
          )}>
            <Clock className="w-4 h-4" />
            <span className="font-mono text-lg font-medium">{formatTime(pomodoroTime)}</span>
            <span className="text-xs text-muted-foreground uppercase">{pomodoroMode}</span>
          </div>
          <button
            onClick={isPomodoroRunning ? pausePomodoro : startPomodoro}
            className="liquid-glass rounded-full px-4 py-2 text-sm hover:scale-[1.03] transition-all"
          >
            {isPomodoroRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetPomodoro}
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            Reset
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowChat(!showChat)}
            className={cn(
              "p-2 rounded-full transition-colors",
              showChat ? 'bg-foreground/10 text-foreground' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Participants Grid */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl w-full">
              {/* Current User */}
              <div className="aspect-square rounded-2xl liquid-glass flex flex-col items-center justify-center gap-3 p-4">
                <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center">
                  <span className="font-display text-2xl text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-sm text-foreground font-medium">{userName} (You)</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {isMuted ? (
                      <MicOff className="w-3 h-3 text-red-400" />
                    ) : (
                      <Volume2 className="w-3 h-3 text-emerald-400" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {isMuted ? 'Muted' : 'Speaking'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Other Participants */}
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="aspect-square rounded-2xl liquid-glass flex flex-col items-center justify-center gap-3 p-4"
                >
                  <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center">
                    <span className="font-display text-2xl text-foreground" style={{ fontFamily: "'Instrument Serif', serif" }}>
                      {participant.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-foreground font-medium">{participant.name}</p>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {participant.isMuted ? (
                        <MicOff className="w-3 h-3 text-red-400" />
                      ) : (
                        <Volume2 className="w-3 h-3 text-emerald-400" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        {participant.isMuted ? 'Muted' : 'Speaking'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty slots */}
              {Array.from({ length: Math.max(0, 8 - participants.length - 1) }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="aspect-square rounded-2xl border border-dashed border-border/30 flex items-center justify-center"
                >
                  <Users className="w-8 h-8 text-muted-foreground/20" />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-center gap-4 p-6 border-t border-border/30">
            <button
              onClick={toggleMute}
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-[1.05]",
                isMuted
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'liquid-glass text-foreground'
              )}
            >
              {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            <button
              onClick={handleLeave}
              className="w-14 h-14 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center hover:scale-[1.05] transition-all"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Chat Sidebar */}
        {showChat && (
          <div className="w-80 border-l border-border/30 flex flex-col bg-background/50 backdrop-blur-sm">
            <div className="p-4 border-b border-border/30">
              <h3 className="text-sm font-medium text-foreground">Room Chat</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">
                  No messages yet. Say hello!
                </p>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col",
                    msg.senderId === 'self' ? 'items-end' : 'items-start'
                  )}
                >
                  <div className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5",
                    msg.senderId === 'self'
                      ? 'bg-foreground/10 text-foreground'
                      : 'liquid-glass text-foreground'
                  )}>
                    <p className="text-xs text-muted-foreground mb-1">{msg.senderName}</p>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              {typingUsers.length > 0 && (
                <div className="flex items-center gap-2 text-muted-foreground text-xs">
                  <div className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>{typingUsers.join(', ')} typing...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-border/30">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={handleTyping}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border border-border/30 rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center hover:scale-[1.05] transition-all disabled:opacity-30"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
