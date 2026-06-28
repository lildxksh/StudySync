import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface Participant {
  id: string;
  name: string;
  isMuted: boolean;
}

interface ChatMessage {
  id: number;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export function useWebRTC(roomId: string, userName: string) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  // Initialize socket and get local media
  useEffect(() => {
    const socket = io('http://localhost:3001');
    socketRef.current = socket;

    // Get local audio stream
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then((stream) => {
        localStreamRef.current = stream;

        // Join room
        socket.emit('join-room', { roomId, userName });
        setIsConnected(true);
      })
      .catch((err) => {
        console.error('Failed to get microphone:', err);
      });

    return () => {
      // Cleanup
      localStreamRef.current?.getTracks().forEach(track => track.stop());
      peerConnectionsRef.current.forEach(pc => pc.close());
      peerConnectionsRef.current.clear();
      audioElementsRef.current.forEach(audio => audio.remove());
      audioElementsRef.current.clear();
      socket.disconnect();
    };
  }, [roomId, userName]);

  // Handle socket events
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    // New user joined - create offer
    socket.on('user-joined', async ({ id, name }: { id: string; name: string }) => {
      console.log('User joined:', name, id);

      const pc = createPeerConnection(id);

      // Add local stream tracks
      localStreamRef.current?.getTracks().forEach(track => {
        if (localStreamRef.current) {
          pc.addTrack(track, localStreamRef.current);
        }
      });

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket.emit('offer', { offer, targetId: id, roomId });
    });

    // Receive offer - create answer
    socket.on('offer', async ({ offer, senderId }: { offer: RTCSessionDescriptionInit; senderId: string }) => {
      const pc = createPeerConnection(senderId);

      localStreamRef.current?.getTracks().forEach(track => {
        if (localStreamRef.current) {
          pc.addTrack(track, localStreamRef.current);
        }
      });

      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('answer', { answer, targetId: senderId, roomId });
    });

    // Receive answer
    socket.on('answer', async ({ answer, senderId }: { answer: RTCSessionDescriptionInit; senderId: string }) => {
      const pc = peerConnectionsRef.current.get(senderId);
      if (pc) {
        await pc.setRemoteDescription(answer);
      }
    });

    // Receive ICE candidate
    socket.on('ice-candidate', async ({ candidate, senderId }: { candidate: RTCIceCandidateInit; senderId: string }) => {
      const pc = peerConnectionsRef.current.get(senderId);
      if (pc) {
        await pc.addIceCandidate(candidate);
      }
    });

    // Existing participants
    socket.on('existing-participants', (participants: Participant[]) => {
      setParticipants(prev => [...prev, ...participants]);
    });

    // Room joined
    socket.on('room-joined', ({ participants }: { participants: Participant[] }) => {
      setParticipants(participants);
    });

    // User left
    socket.on('user-left', (userId: string) => {
      setParticipants(prev => prev.filter(p => p.id !== userId));

      const pc = peerConnectionsRef.current.get(userId);
      if (pc) {
        pc.close();
        peerConnectionsRef.current.delete(userId);
      }

      const audio = audioElementsRef.current.get(userId);
      if (audio) {
        audio.remove();
        audioElementsRef.current.delete(userId);
      }
    });

    // Chat messages
    socket.on('chat-message', (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
    });

    // User muted/unmuted
    socket.on('user-muted', ({ userId, isMuted }: { userId: string; isMuted: boolean }) => {
      setParticipants(prev => 
        prev.map(p => p.id === userId ? { ...p, isMuted } : p)
      );
    });

    // Typing indicators
    socket.on('user-typing', ({ userName }: { userName: string }) => {
      setTypingUsers(prev => [...new Set([...prev, userName])]);
    });

    socket.on('user-stop-typing', ({ userId }: { userId: string }) => {
      setTypingUsers(prev => prev.filter(name => name !== userId));
    });

    return () => {
      socket.off('user-joined');
      socket.off('offer');
      socket.off('answer');
      socket.off('ice-candidate');
      socket.off('existing-participants');
      socket.off('room-joined');
      socket.off('user-left');
      socket.off('chat-message');
      socket.off('user-muted');
      socket.off('user-typing');
      socket.off('user-stop-typing');
    };
  }, [roomId]);

  const createPeerConnection = useCallback((peerId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionsRef.current.set(peerId, pc);

    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('ice-candidate', {
          candidate: event.candidate,
          targetId: peerId,
          roomId,
        });
      }
    };

    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;

      // Create audio element for this peer
      let audio = audioElementsRef.current.get(peerId);
      if (!audio) {
        audio = document.createElement('audio');
        audio.autoplay = true;
        audioElementsRef.current.set(peerId, audio);
        document.body.appendChild(audio);
      }
      audio.srcObject = remoteStream;
    };

    return pc;
  }, [roomId]);

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    localStreamRef.current?.getAudioTracks().forEach(track => {
      track.enabled = !newMuted;
    });

    socketRef.current?.emit('toggle-mute', { roomId, isMuted: newMuted });
  }, [isMuted, roomId]);

  const sendMessage = useCallback((message: string) => {
    socketRef.current?.emit('chat-message', { roomId, message, userName });
  }, [roomId, userName]);

  const sendTyping = useCallback(() => {
    socketRef.current?.emit('typing', { roomId, userName });
  }, [roomId, userName]);

  const stopTyping = useCallback(() => {
    socketRef.current?.emit('stop-typing', { roomId });
  }, [roomId]);

  const leaveRoom = useCallback(() => {
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();
    audioElementsRef.current.forEach(audio => audio.remove());
    audioElementsRef.current.clear();
    socketRef.current?.disconnect();
    setIsConnected(false);
    setParticipants([]);
    setMessages([]);
  }, []);

  return {
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
    localStream: localStreamRef.current,
  };
}
