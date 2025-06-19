'use client'

interface HeaderProps {
  playerName: string
  currentPoints: number
  level: number
}

export default function Header({
  playerName,
  currentPoints,
  level,
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 lg:py-4 flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg lg:text-2xl font-bold text-gray-900">📋 TaskQuest</h1>
        </div>

        <div className="flex items-center space-x-3 lg:space-x-6">
          <div className="flex items-center space-x-1 lg:space-x-2">
            <span className="text-xs lg:text-sm text-gray-600 hidden sm:inline">Points:</span>
            <span className="bg-blue-100 text-blue-800 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold">
              {currentPoints}
            </span>
          </div>

          <div className="flex items-center space-x-1 lg:space-x-2">
            <span className="text-xs lg:text-sm text-gray-600 hidden sm:inline">Level:</span>
            <span className="bg-purple-100 text-purple-800 px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold">
              {level}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs lg:text-sm font-semibold text-gray-600">
                {playerName.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-xs lg:text-sm font-medium text-gray-700 hidden md:inline">
              {playerName}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
