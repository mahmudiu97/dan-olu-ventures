import React from 'react'

// Premium branded loader with system design
export function ProfessionalLoader({ 
  size = 'md', 
  color = 'primary', 
  message = 'Loading...', 
  overlay = false,
  className = '' 
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }
  
  const colorClasses = {
    primary: 'text-indigo-600',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-orange-600',
    danger: 'text-red-600',
    white: 'text-white'
  }

  const messageSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const LoaderContent = () => (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Modern Ring Loader */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer ring */}
        <div className={`absolute inset-0 rounded-full border-4 border-gray-200`}></div>
        
        {/* Animated ring */}
        <div className={`absolute inset-0 rounded-full border-4 border-transparent border-t-${color === 'primary' ? 'indigo' : color}-600 animate-spin`}></div>
        
        {/* Center dot */}
        <div className={`absolute inset-0 flex items-center justify-center`}>
          <div className={`w-2 h-2 rounded-full bg-${color === 'primary' ? 'indigo' : color}-600 animate-pulse`}></div>
        </div>
      </div>
      
      {/* Loading message */}
      {message && (
        <div className="text-center">
          <p className={`${messageSizeClasses[size]} font-medium text-gray-700 animate-pulse`}>
            {message}
          </p>
          <div className="flex space-x-1 justify-center mt-2">
            <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      )}
    </div>
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
          <LoaderContent />
        </div>
      </div>
    )
  }

  return <LoaderContent />
}

// Modern pulse loader for subtle loading
export function PulseLoader({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  
  const colorClasses = {
    primary: 'bg-indigo-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    warning: 'bg-orange-600',
    danger: 'bg-red-600',
    white: 'bg-white'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-pulse shadow-lg`}>
        <div className={`w-1/2 h-1/2 ${color === 'white' ? 'bg-gray-200' : 'bg-white'} rounded-full animate-ping`}></div>
      </div>
    </div>
  )
}

// Professional skeleton loader for content
export function SkeletonLoader({ 
  lines = 3, 
  avatar = false, 
  className = '' 
}) {
  return (
    <div className={`animate-pulse ${className}`}>
      {avatar && (
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {[...Array(lines)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div 
              className="h-4 bg-gray-200 rounded" 
              style={{ width: `${Math.random() * 30 + 70}%` }}
            ></div>
            {i === 0 && <div className="h-3 bg-gray-200 rounded w-1/4"></div>}
          </div>
        ))}
      </div>
    </div>
  )
}

// Progress bar loader
export function ProgressLoader({ 
  progress = 0, 
  color = 'primary',
  showPercentage = true,
  className = '' 
}) {
  const colorClasses = {
    primary: 'bg-indigo-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    warning: 'bg-orange-600',
    danger: 'bg-red-600'
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Processing...</span>
        {showPercentage && (
          <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${colorClasses[color]} h-2 rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        >
          <div className="h-full bg-white bg-opacity-30 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

// Full screen professional loader
export function FullScreenLoader({ 
  message = 'Loading...', 
  subtitle = 'Please wait while we process your request',
  color = 'primary'
}) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Main loader */}
        <div className="relative w-20 h-20 mb-8">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-indigo-600 animate-spin"></div>
          
          {/* Inner elements */}
          <div className="absolute inset-2 flex items-center justify-center">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm animate-pulse"></div>
            </div>
          </div>
        </div>
        
        {/* Messages */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-800 animate-pulse">
            {message}
          </h2>
          <p className="text-gray-600 text-sm max-w-md">
            {subtitle}
          </p>
        </div>
        
        {/* Loading dots */}
        <div className="flex space-x-2 justify-center mt-6">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}

// Button loader with professional styling
export function ButtonLoader({ 
  text = 'Loading...', 
  color = 'primary',
  size = 'md',
  className = '' 
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  const colorClasses = {
    primary: 'text-white',
    secondary: 'text-gray-700',
    success: 'text-white',
    warning: 'text-white',
    danger: 'text-white'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}>
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinecap="round"
            strokeDasharray="31.416 31.416"
            className="opacity-25"
          />
          <path 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            className="opacity-75"
            fill="currentColor"
          />
        </svg>
      </div>
      <span className="font-medium">{text}</span>
    </div>
  )
}

// Card loader for content areas
export function CardLoader({ 
  title = true, 
  lines = 3, 
  avatar = false,
  className = '' 
}) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      {title && (
        <div className="animate-pulse mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
      )}
      
      <SkeletonLoader lines={lines} avatar={avatar} />
    </div>
  )
}

// Table row professional loader
export function TableLoader({ 
  columns = 4, 
  rows = 3,
  className = '' 
}) {
  return (
    <tbody className={className}>
      {[...Array(rows)].map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          {[...Array(columns)].map((_, colIndex) => (
            <td key={colIndex} className="p-3">
              <div 
                className="h-4 bg-gray-200 rounded" 
                style={{ width: `${Math.random() * 40 + 60}%` }}
              ></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

// Default export with most common loader
export default function Loader({ 
  type = 'professional', 
  ...props 
}) {
  const loaders = {
    professional: <ProfessionalLoader {...props} />,
    pulse: <PulseLoader {...props} />,
    skeleton: <SkeletonLoader {...props} />,
    progress: <ProgressLoader {...props} />,
    fullScreen: <FullScreenLoader {...props} />,
    button: <ButtonLoader {...props} />,
    card: <CardLoader {...props} />,
    table: <TableLoader {...props} />
  }
  
  return loaders[type] || loaders.professional
}
