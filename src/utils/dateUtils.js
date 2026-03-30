// Date utility functions for consistent date handling

export function formatDate(dateString) {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return '-'
  }
}

export function formatDateTime(dateString) {
  if (!dateString) return '-'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting datetime:', error)
    return '-'
  }
}

export function formatTime(timeString) {
  if (!timeString) return '-'
  return timeString
}

export function getCurrentDateISO() {
  return new Date().toISOString()
}

export function getCurrentTime() {
  return new Date().toLocaleTimeString()
}

export function getDueDate(daysFromNow = 30) {
  const dueDate = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000)
  return dueDate.toISOString()
}

export function isValidDate(dateString) {
  if (!dateString) return false
  
  try {
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  } catch (error) {
    return false
  }
}

export function isOverdue(dueDateString) {
  if (!dueDateString) return false
  
  try {
    const dueDate = new Date(dueDateString)
    const now = new Date()
    return dueDate < now
  } catch (error) {
    return false
  }
}
