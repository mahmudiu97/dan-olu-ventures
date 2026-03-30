// Image utility functions for better image handling

export function compressImage(base64, maxWidth = 800, maxHeight = 600, quality = 0.8) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // Calculate new dimensions
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }
      
      // Set canvas dimensions
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      
      // Convert to compressed base64
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedBase64)
    }
    
    img.onerror = () => {
      console.error('Failed to load image for compression')
      resolve(base64) // Return original if compression fails
    }
    
    img.src = base64
  })
}

export function validateImageFile(file) {
  const errors = []
  
  // Check file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    errors.push('Invalid file type. Please use JPG, PNG, or GIF.')
  }
  
  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    errors.push(`File too large. Maximum size is 10MB, your file is ${(file.size / 1024 / 1024).toFixed(1)}MB.`)
  }
  
  // Check file name length
  if (file.name.length > 100) {
    errors.push('File name too long. Maximum 100 characters.')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function getImageDimensions(base64) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      })
    }
    img.onerror = () => {
      resolve({ width: 0, height: 0 })
    }
    img.src = base64
  })
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  const f = bytes / Math.pow(k, i)
  return parseFloat(f.toFixed(2)) + ' ' + sizes[i]
}

// Firebase friendly image processing
export async function processImageForFirebase(file) {
  try {
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '))
    }
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async (event) => {
        try {
          let base64 = event.target.result
          
          // Compress large images
          if (file.size > 2 * 1024 * 1024) { // > 2MB
            console.log('Compressing large image...')
            base64 = await compressImage(base64)
          }
          
          const dimensions = await getImageDimensions(base64)
          
          resolve({
            base64,
            size: base64.length,
            originalSize: file.size,
            dimensions,
            compressed: file.size > 2 * 1024 * 1024
          })
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }
      
      reader.readAsDataURL(file)
    })
  } catch (error) {
    throw new Error(`Image processing failed: ${error.message}`)
  }
}
