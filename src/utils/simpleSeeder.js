import { addCategory } from '../services/categoryService'
import { addInventory } from '../services/inventoryService'
import { auth } from '../services/firebase'

// Enhanced categories with better descriptions and colors
const categories = [
  {
    name: 'Footwear',
    description: 'Quality shoes, sneakers, and footwear for all occasions',
    color: '#3B82F6'
  },
  {
    name: 'Phone Accessories',
    description: 'Chargers, cables, cases, and phone accessories',
    color: '#10B981'
  },
  {
    name: 'Electronics',
    description: 'Electronic devices and gadgets',
    color: '#8B5CF6'
  },
  {
    name: 'Fashion',
    description: 'Clothing and fashion accessories',
    color: '#EC4899'
  },
  {
    name: 'Sports',
    description: 'Sports equipment and accessories',
    color: '#F59E0B'
  }
]

// Enhanced products with realistic images
const products = [
  // Footwear Products
  {
    name: 'Nike Air Max 270',
    category: 'Footwear',
    qty: 15,
    unitPrice: 45000,
    costPrice: 32000,
    minSellingPrice: 35000,
    maxSellingPrice: 55000,
    note: 'Popular running shoes with air cushioning technology',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA2MEgxNjBWMTQwSDQwVjYwWiIgZmlsbD0iIzJEMjQyRCIvPgo8cGF0aCBkPSJNNjAgODBIMTQwVjEwMEg2MFY4MFoiIGZpbGw9IiM0NzQ3NDciLz4KPGNpcmNsZSBjeD0iODAiIGN5PSI5MCIgcj0iOCIgZmlsbD0iIzJEMjQyRCIvPgo8Y2lyY2xlIGN4PSIxMjAiIGN5PSI5MCIgcj0iOCIgZmlsbD0iIzJEMjQyRCIvPgo8dGV4dCB4PSIxMDAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMjQyNDI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5OaWtlIEFpciBNYXggMjcwPC90ZXh0Pgo8L3N2Zz4='
  },
  {
    name: 'Adidas Ultraboost 22',
    category: 'Footwear',
    qty: 12,
    unitPrice: 52000,
    costPrice: 38000,
    minSellingPrice: 40000,
    maxSellingPrice: 65000,
    note: 'Premium running shoes with responsive boost cushioning',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik00MCA2MEgxNjBWMTQwSDQwVjYwWiIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNNjAgODBIMTQwVjEwMEg2MFY4MFoiIGZpbGw9IiMwMDAwMDAiLz4KPHN2ZyB4PSI4MCIgeT0iODUiIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDQwIDMwIiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEwIDE1TDMwIDVMMzAgMjVMMTAgMTVaIiBmaWxsPSIjMDAwMDAwIi8+Cjwvc3ZnPgo8dGV4dCB4PSIxMDAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMjQyNDI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BZGlkYXMgVWx0cmFib29zdCAyMjwvdGV4dD4KPC9zdmc+'
  },
  {
    name: 'Puma RS-X³',
    category: 'Footwear',
    qty: 18,
    unitPrice: 35000,
    costPrice: 25000,
    minSellingPrice: 28000,
    maxSellingPrice: 42000,
    note: 'Retro-inspired sneakers with modern comfort',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkY2QjZCIi8+CjxwYXRoIGQ9Ik00MCA2MEgxNjBWMTQwSDQwVjYwWiIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNNjAgODBIMTQwVjEwMEg2MFY4MFoiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iTTgwIDcwSDEyMFYxMTBIMTBWNzBaIiBmaWxsPSIjMDAwMDAwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMyNDI0MjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlB1bWEgUlMtWMzwL3RleHQ+Cjwvc3ZnPg=='
  },

  // Phone Accessories
  {
    name: 'Type-C Fast Charger 65W',
    category: 'Phone Accessories',
    qty: 25,
    unitPrice: 4500,
    costPrice: 2800,
    minSellingPrice: 3200,
    maxSellingPrice: 5500,
    note: 'Fast charging adapter for Type-C devices',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjcwIiB5PSI2MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjgwIiByeD0iMTAiIGZpbGw9IiMyRDQyNEQiLz4KPHJlY3QgeD0iODAiIHk9IjUwIiB3aWR0aD0iNDAiIGhlaWdodD0iMjAiIHJ4PSI1IiBmaWxsPSIjNDc0NzQ3Ii8+CjxjaXJjbGUgY3g9Ijk4IiBjeT0iODAiIHI9IjgiIGZpbGw9IiNGRkYwMDAiLz4KPHRleHQgeD0iMTAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzI0MjQyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VHlwZS1DIDY1VyBDaGFyZ2VyPC90ZXh0Pgo8L3N2Zz4='
  },
  {
    name: 'iPhone 14 Pro Case',
    category: 'Phone Accessories',
    qty: 30,
    unitPrice: 2500,
    costPrice: 1500,
    minSellingPrice: 1800,
    maxSellingPrice: 3500,
    note: 'Protective case for iPhone 14 Pro',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHg9IjYwIiB5PSI0MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjEyMCIgcng9IjEwIiBmaWxsPSIjMDAwMDAwIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjcwIiByPSIxNSIgZmlsbD0iIzI0MjQyNCIvPgo8cmVjdCB4PSI5NSIgeT0iODUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIzMCIgcng9IjIiIGZpbGw9IiMyNDI0MjQiLz4KPHRleHQgeD0iMTAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzI0MjQyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+aVBob25lIDE0IFBybyBDYXNlPC90ZXh0Pgo8L3N2Zz4='
  },
  {
    name: 'USB-C Cable 2m',
    category: 'Phone Accessories',
    qty: 40,
    unitPrice: 1500,
    costPrice: 800,
    minSellingPrice: 1000,
    maxSellingPrice: 2000,
    note: 'High-quality USB-C charging cable, 2 meters',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAxMDBIMTYwVjEwMEg0MFYxMDBaIiBzdHJva2U9IiM0NzQ3NDciIHN0cm9rZS13aWR0aD0iOCIgZmlsbD0ibm9uZSIvPgo8cmVjdCB4PSIzNSIgeT0iOTUiIHdpZHRoPSIxNSIgaGVpZ2h0PSIxMCIgcng9IjMiIGZpbGw9IiMyRDQyNEQiLz4KPHJlY3QgeD0iMTUwIiB5PSI5NSIgd2lkdGg9IjE1IiBoZWlnaHQ9IjEwIiByeD0iMyIgZmlsbD0iIzJEMjQyRCIvPgo8dGV4dCB4PSIxMDAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMjQyNDI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5VU0ItQyBDYWJsZSAybTwvdGV4dD4KPC9zdmc+'
  },

  // Electronics
  {
    name: 'Wireless Earbuds Pro',
    category: 'Electronics',
    qty: 20,
    unitPrice: 12000,
    costPrice: 8000,
    minSellingPrice: 9000,
    maxSellingPrice: 15000,
    note: 'Premium wireless earbuds with noise cancellation',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxlbGxpcHNlIGN4PSI2MCIgY3k9IjEwMCIgcng9IjIwIiByeT0iMjUiIGZpbGw9IiMyNDI0MjQiLz4KPGVsbGlwc2UgY3g9IjE0MCIgY3k9IjEwMCIgcng9IjIwIiByeT0iMjUiIGZpbGw9IiMyNDI0MjQiLz4KPGNpcmNsZSBjeD0iNjAiIGN5PSI5NSIgcj0iNSIgZmlsbD0iI0ZGRjAwMCIvPgo8Y2lyY2xlIGN4PSIxNDAiIGN5PSI5NSIgcj0iNSIgZmlsbD0iI0ZGRjAwMCIvPgo8dGV4dCB4PSIxMDAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMjQyNDI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5XaXJlbGVzcyBFYXJidWRzIFBybzwvdGV4dD4KPC9zdmc+'
  },
  {
    name: 'Portable Power Bank 20000mAh',
    category: 'Electronics',
    qty: 15,
    unitPrice: 8500,
    costPrice: 5500,
    minSellingPrice: 6500,
    maxSellingPrice: 10000,
    note: 'High-capacity portable power bank',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjUwIiB5PSI2MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI4MCIgcng9IjEwIiBmaWxsPSIjNDc0NzQ3Ii8+CjxyZWN0IHg9IjcwIiB5PSI3MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjQwIiByeD0iNSIgZmlsbD0iIzJEMjQyRCIvPgo8Y2lyY2xlIGN4PSI5MCIgY3k9IjkwIiByPSIzIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjExMCIgY3k9IjkwIiByPSIzIiBmaWxsPSIjRkZGRkZGIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiMyNDI0MjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlBvd2VyIEJhbmsgMjAwMDBtQWhoPC90ZXh0Pgo8L3N2Zz4='
  },

  // Fashion
  {
    name: 'Designer Sunglasses',
    category: 'Fashion',
    qty: 25,
    unitPrice: 8000,
    costPrice: 5000,
    minSellingPrice: 6000,
    maxSellingPrice: 12000,
    note: 'Stylish designer sunglasses with UV protection',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik00MCAxMDBIMjAwVjEyMEg0MFYxMDBaIiBmaWxsPSIjMDAwMDAwIi8+CjxwYXRoIGQ9Ik0wIDEwMEgxNjBWMTIwSDBWMTAwWiIgZmlsbD0iIzAwMDAwMCIvPgo8cmVjdCB4PSI2MCIgeT0iOTUiIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgcng9IjIwIiBmaWxsPSIjMjQyNDI0Ii8+CjxyZWN0IHg9IjEwMCIgeT0iOTUiIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgcng9IjIwIiBmaWxsPSIjMjQyNDI0Ii8+CjxwYXRoIGQ9IjEwMCA5MEgxMDBWMTIwSDEwMFY5MFoiIGZpbGw9IiMyNDI0MjQiLz4KPHRleHQgeD0iMTAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzI0MjQyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RGVzaWduZXIgU3VuZ2xhc3NlczwvdGV4dD4KPC9zdmc+'
  },

  // Sports
  {
    name: 'Professional Football',
    category: 'Sports',
    qty: 20,
    unitPrice: 5500,
    costPrice: 3500,
    minSellingPrice: 4000,
    maxSellingPrice: 7000,
    note: 'Professional grade football for training and matches',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIzOCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiLz4KPHBhdGggZD0iTTEwMCA2MkwxMDAgMTM4TTYyIDEwMEwxMzggMTAwIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIxMDAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMjQyNDI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Qcm9mZXNzaW9uYWwgRm9vdGJhbGw8L3RleHQ+Cjwvc3ZnPg=='
  },
  {
    name: 'Yoga Mat Premium',
    category: 'Sports',
    qty: 30,
    unitPrice: 3500,
    costPrice: 2200,
    minSellingPrice: 2500,
    maxSellingPrice: 4500,
    note: 'Premium non-slip yoga mat with carrying strap',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHg9IjQwIiB5PSI2MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI4MCIgcng9IjEwIiBmaWxsPSIjRkY2QjZCIi8+CjxyZWN0IHg9IjUwIiB5PSI3MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI2MCIgcng9IjUiIGZpbGw9IiNGRkYwMDAiLz4KPHBhdGggZD0iTTMwIDcwSDMwVjEzMEgzMFY3MFoiIGZpbGw9IiNGRjAwMDAiLz4KPHBhdGggZD0iTTE3MCA3MEgxNzBWMjEzMFY3MFoiIGZpbGw9IiNGRjAwMDAiLz4KPHRleHQgeD0iMTAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzI0MjQyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+WW9nYSBNYXQgUHJlbWl1bTwvdGV4dD4KPC9zdmc+'
  }
]

// Simple seeder function
export async function seedSimpleData() {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to seed data')
  }

  console.log('🌱 Starting simple data seeding...')
  
  try {
    // Seed categories first
    console.log('📁 Seeding categories...')
    for (const category of categories) {
      try {
        await addCategory(category)
        console.log(`✅ Category added: ${category.name}`)
      } catch (error) {
        console.log(`⚠️ Category ${category.name} may already exist:`, error.message)
      }
    }

    // Wait a bit for categories to be available
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Seed products
    console.log('📦 Seeding products...')
    for (const product of products) {
      try {
        await addInventory(product)
        console.log(`✅ Product added: ${product.name}`)
      } catch (error) {
        console.log(`⚠️ Product ${product.name} may already exist:`, error.message)
      }
    }

    console.log('🎉 Simple data seeding completed successfully!')
    console.log(`📊 Seeded ${categories.length} categories and ${products.length} products`)
    
    return {
      success: true,
      categories: categories.length,
      products: products.length
    }
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

// Function to run seeder from browser console
export function runSimpleSeeder() {
  console.log('🚀 Starting simple seeder...')
  seedSimpleData()
    .then(result => {
      console.log('✅ Seeder completed:', result)
      alert(`Seeding completed! Added ${result.categories} categories and ${result.products} products.`)
    })
    .catch(error => {
      console.error('❌ Seeder failed:', error)
      alert('Seeding failed: ' + error.message)
    })
}

// Make available globally for browser console
if (typeof window !== 'undefined') {
  window.seedSimpleData = seedSimpleData
  window.runSimpleSeeder = runSimpleSeeder
}
