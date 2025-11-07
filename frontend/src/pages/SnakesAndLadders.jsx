import Chat from '../components/Chat'

function SnakesAndLadders({ roomData }) {
  return (
    <div className="min-h-screen bg-[--bg] text-[--text] p-4 relative">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">Snakes and Ladders</h1>
        <p className="text-center text-gray-600 mb-6">
          Room: {roomData?.roomId} | Game: {roomData?.gameName}
        </p>
        {/* Game implementation will go here */}
      </div>
      {roomData?.socket && roomData?.roomId && (
        <Chat socket={roomData.socket} roomId={roomData.roomId} />
      )}
    </div>
  )
}

export default SnakesAndLadders

