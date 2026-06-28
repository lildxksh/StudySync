import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ExploreRooms from './components/ExploreRooms'
import RoomBrowser from './components/RoomBrowser'
import StudyRoom from './components/StudyRoom'

type View = 'home' | 'explore' | 'rooms' | 'room'

function App() {
  const [view, setView] = useState<View>('home')
  const [activeRoomId, setActiveRoomId] = useState('')
  const [userName, setUserName] = useState('')

  const handleJoinRoom = (roomId: string, name: string) => {
    setActiveRoomId(roomId)
    setUserName(name)
    setView('room')
  }

  const handleLeaveRoom = () => {
    setActiveRoomId('')
    setUserName('')
    setView('explore')
  }

  const handleExplore = () => {
    setView('explore')
  }

  const handleGoHome = () => {
    setView('home')
  }

  const handleCreateRoom = () => {
    // For now, redirect to RoomBrowser which has create room modal
    setView('rooms')
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background Video - only on home and explore */}
      {(view === 'home' || view === 'explore') && (
        <video
          className="fixed inset-0 w-full h-full object-cover z-0"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
      )}

      {/* Dark background for other views */}
      {view !== 'home' && view !== 'explore' && (
        <div className="fixed inset-0 bg-background z-0" />
      )}

      {/* Navbar - hide when in a room */}
      {view !== 'room' && (
        <Navbar
          onExplore={handleExplore}
          onHome={handleGoHome}
          currentView={view}
        />
      )}

      {/* Views */}
      {view === 'home' && (
        <Hero onJoinRoom={handleExplore} />
      )}

      {view === 'explore' && (
        <ExploreRooms
          onJoinRoom={(roomId) => {
            // Show a name prompt or use default
            const name = prompt('Enter your name to join the room:') || 'Guest'
            handleJoinRoom(roomId, name)
          }}
          onCreateRoom={handleCreateRoom}
        />
      )}

      {view === 'rooms' && (
        <RoomBrowser onJoinRoom={handleJoinRoom} />
      )}

      {view === 'room' && activeRoomId && (
        <StudyRoom
          roomId={activeRoomId}
          userName={userName}
          onLeave={handleLeaveRoom}
        />
      )}
    </div>
  )
}

export default App
