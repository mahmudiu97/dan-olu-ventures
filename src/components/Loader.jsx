import React from 'react'

// Simple spinner loader
export function Spinner({ size = 'md', color = 'indigo', className = '' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }
  
  const colorClasses = {
    indigo: 'text-indigo-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    gray: 'text-gray-600',
    white: 'text-white'
  }
  
  return (
    <div className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}>
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
  )
}

// Dots loader
export function Dots({ color = 'indigo', className = '' }) {
  const colorClasses = {
    indigo: 'bg-indigo-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    gray: 'bg-gray-600',
    white: 'bg-white'
  }
  
  return (
    <div className={`flex space-x-1 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${colorClasses[color]} animate-bounce`} style={{ animationDelay: '0ms' }}></div>
      <div className={`w-2 h-2 rounded-full ${colorClasses[color]} animate-bounce`} style={{ animationDelay: '150ms' }}></div>
      <div className={`w-2 h-2 rounded-full ${colorClasses[color]} animate-bounce`} style={{ animationDelay: '300ms' }}></div>
    </div>
  )
}

// Pulse loader
export function Pulse({ color = 'indigo', className = '' }) {
  const colorClasses = {
    indigo: 'bg-indigo-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    gray: 'bg-gray-600',
    white: 'bg-white'
  }
  
  return (
    <div className={`w-8 h-8 rounded-full ${colorClasses[color]} animate-pulse ${className}`}></div>
  )
}

// Full page loader
export function FullPageLoader({ message = 'Loading...', color = 'indigo' }) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <Spinner size="xl" color={color} className="mx-auto mb-4" />
        <p className={`text-lg font-medium text-${color}-600`}>{message}</p>
      </div>
    </div>
  )
}

// Button loader (for loading buttons)
export function ButtonLoader({ text = 'Loading...', color = 'white' }) {
  return (
    <div className="flex items-center space-x-2">
      <Spinner size="sm" color={color} />
      <span>{text}</span>
    </div>
  )
}

// Card loader (skeleton loader)
export function CardLoader({ lines = 3, className = '' }) {
  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="space-y-2">
          {[...Array(lines)].map((_, i) => (
            <div key={i} className="h-3 bg-gray-200 rounded" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Table row loader
export function TableRowLoader({ columns = 4, className = '' }) {
  return (
    <tr className={`animate-pulse ${className}`}>
      {[...Array(columns)].map((_, i) => (
        <td key={i} className="p-3">
          <div className="h-4 bg-gray-200 rounded"></div>
        </td>
      ))}
    </tr>
  )
}

// Simple text loader
export function TextLoader({ text = 'Loading...', color = 'indigo' }) {
  const colorClasses = {
    indigo: 'text-indigo-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    gray: 'text-gray-600'
  }
  
  return (
    <div className={`flex items-center space-x-2 ${colorClasses[color]}`}>
      <Spinner size="sm" color={color} />
      <span className="text-sm">{text}</span>
    </div>
  )
}

// Default export with most common loader
export default function Loader({ type = 'spinner', ...props }) {
  const loaders = {
    spinner: <Spinner {...props} />,
    dots: <Dots {...props} />,
    pulse: <Pulse {...props} />,
    fullPage: <FullPageLoader {...props} />,
    button: <ButtonLoader {...props} />,
    card: <CardLoader {...props} />,
    table: <TableRowLoader {...props} />,
    text: <TextLoader {...props} />
  }
  
  return loaders[type] || loaders.spinner
}
