import { addCategory } from '../services/categoryService'
import { addInventory } from '../services/inventoryService'
import { auth } from '../services/firebase'

// Sample data for shoes and phone charges
const sampleCategories = [
  {
    name: 'Footwear',
    description: 'Shoes, sandals, and other footwear products',
    color: '#3B82F6'
  },
  {
    name: 'Electronics',
    description: 'Phone accessories and electronic devices',
    color: '#10B981'
  }
]

const sampleProducts = [
  // Shoes
  {
    name: 'Nike Air Max 270',
    category: 'Footwear',
    qty: 15,
    unitPrice: 45000,
    costPrice: 32000,
    minSellingPrice: 35000,
    maxSellingPrice: 55000,
    note: 'Popular running shoes with air cushioning',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA2MEgxNjBWMTQwSDQwVjYwWiIgZmlsbD0iIzJEMjQyRCIvPgo8cGF0aCBkPSJNNjAgODBIMTQwVjEwMEg2MFY4MFoiIGZpbGw9IiM0NzQ3NDciLz4KPGNpcmNsZSBjeD0iODAiIGN5PSI5MCIgcj0iOCIgZmlsbD0iIzJEMjQyRCIvPgo8Y2lyY2xlIGN4PSIxMjAiIGN5PSI5MCIgcj0iOCIgZmlsbD0iIzJEMjQyRCIvPgo8dGV4dCB4PSIxMDAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMjQyNDI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5OaWtlPC90ZXh0Pgo8L3N2Zz4='
  },
  {
    name: 'Adidas Ultraboost 22',
    category: 'Footwear',
    qty: 12,
    unitPrice: 52000,
    costPrice: 38000,
    minSellingPrice: 40000,
    maxSellingPrice: 65000,
    note: 'Premium running shoes with boost technology',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik00MCA2MEgxNjBWMTQwSDQwVjYwWiIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNNjAgODBIMTQwVjEwMEg2MFY4MFoiIGZpbGw9IiMwMDAwMDAiLz4KPHN2ZyB4PSI4MCIgeT0iODUiIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDQwIDMwIiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTEwIDE1TDMwIDVMMzAgMjVMMTAgMTVaIiBmaWxsPSIjMDAwMDAwIi8+Cjwvc3ZnPgo8dGV4dCB4PSIxMDAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMjQyNDI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BZGlkYXM8L3RleHQ+Cjwvc3ZnPg=='
  },
  {
    name: 'Puma RS-X³',
    category: 'Footwear',
    qty: 18,
    unitPrice: 35000,
    costPrice: 25000,
    minSellingPrice: 28000,
    maxSellingPrice: 42000,
    note: 'Retro-style lifestyle sneakers',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjFGNUY1Ii8+CjxwYXRoIGQ9Ik00MCA2MEgxNjBWMTQwSDQwVjYwWiIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNNjAgODBIMTQwVjEwMEg2MFY4MFoiIGZpbGw9IiMwMDAwMDAiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iOTAiIHI9IjE1IiBmaWxsPSIjRkY2NjAwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMyNDI0MjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlB1bWE8L3RleHQ+Cjwvc3ZnPg=='
  },
  {
    name: 'Converse Chuck Taylor All Star',
    category: 'Footwear',
    qty: 25,
    unitPrice: 22000,
    costPrice: 15000,
    minSellingPrice: 18000,
    maxSellingPrice: 28000,
    note: 'Classic canvas high-top sneakers',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik00MCA2MEgxNjBWMTQwSDQwVjYwWiIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNNjAgODBIMTQwVjEwMEg2MFY4MFoiIGZpbGw9IiMwMDAwMDAiLz4KPGNpcmNsZSBjeD0iODAiIGN5PSI4NSIgcj0iMTAiIGZpbGw9IiMwMDAwMDAiLz4KPGNpcmNsZSBjeD0iMTIwIiBjeT0iODUiIHI9IjEwIiBmaWxsPSIjMDAwMDAwIi8+CjxwYXRoIGQ9Ik04MCA5NUgxMjAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTgwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMyNDI0MjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNvbnZlcnNlPC90ZXh0Pgo8L3N2Zz4='
  },
  {
    name: 'Vans Old Skool',
    category: 'Footwear',
    qty: 20,
    unitPrice: 28000,
    costPrice: 20000,
    minSellingPrice: 23000,
    maxSellingPrice: 35000,
    note: 'Skateboarding shoes with side stripe',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjRGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA2MEgxNjBWMTQwSDQwVjYwWiIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNNjAgODBIMTQwVjEwMEg2MFY4MFoiIGZpbGw9IiMwMDAwMDAiLz4KPHJlY3QgeD0iNzAiIHk9Ijg1IiB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIGZpbGw9IiNGRkY2MDAiLz4KPHRleHQgeD0iMTAwIiB5PSIxODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzI0MjQyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VmFuczwvdGV4dD4KPC9zdmc+'
  },
  {
    name: 'New Balance 574',
    category: 'Footwear',
    qty: 16,
    unitPrice: 32000,
    costPrice: 23000,
    minSellingPrice: 26000,
    maxSellingPrice: 40000,
    note: 'Classic retro running shoes',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjRGNEY2Ii8+CjxwYXRoIGQ9Ik00MCA2MEgxNjBWMTQwSDQwVjYwWiIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNNjAgODBIMTQwVjEwMEg2MFY4MFoiIGZpbGw9IiMwMDAwMDAiLz4KPHJlY3QgeD0iNzAiIHk9Ijg1IiB3aWR0aD0iNjAiIGhlaWdodD0iMTAiIGZpbGw9IiM4QjQ1MTMiLz4KPHJlY3QgeD0iODAiIHk9IjkwIiB3aWR0aD0iNDAiIGhlaWdodD0iNSIgZmlsbD0iIzAwMDAwMCIvPgo8dGV4dCB4PSIxMDAiIHk9IjE4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMjQyNDI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5OZXcgQmFsYW5jZTwvdGV4dD4KPC9zdmc+'
  },
  
  // Phone Charges and Accessories
  {
    name: 'Anker PowerCore 10000',
    category: 'Electronics',
    qty: 30,
    unitPrice: 8500,
    costPrice: 5500,
    minSellingPrice: 6500,
    maxSellingPrice: 12000,
    note: '10000mAh portable power bank',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjYwIiB5PSI4MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzM0MzQ0MCIvPgo8Y2lyY2xlIGN4PSI4NSIgY3k9Ijk1IiByPSI0IiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjExNSIgY3k9Ijk1IiByPSI0IiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik04NSA5NUgxMTUiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMyNDI0MjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFua2VyPC90ZXh0Pgo8L3N2Zz4='
  },
  {
    name: 'iPhone 15 Pro Charger',
    category: 'Electronics',
    qty: 45,
    unitPrice: 4500,
    costPrice: 2800,
    minSellingPrice: 3200,
    maxSellingPrice: 6500,
    note: 'USB-C fast charger 20W',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHg9IjcwIiB5PSI4NSIgd2lkdGg9IjYwIiBoZWlnaHQ9IjMwIiByeD0iNSIgZmlsbD0iIzAwMDAwMCIvPgo8cmVjdCB4PSI4NSIgeT0iOTAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI0Y5RkYwMCIvPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjMiIGZpbGw9IiMwMDAwMDAiLz4KPHRleHQgeD0iMTAwIiB5PSIxNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzI0MjQyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Q2hhcmdlcjwvdGV4dD4KPC9zdmc+'
  },
  {
    name: 'Samsung 25W Fast Charger',
    category: 'Electronics',
    qty: 35,
    unitPrice: 3800,
    costPrice: 2400,
    minSellingPrice: 2800,
    maxSellingPrice: 5500,
    note: 'Super fast charging adapter',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjcwIiB5PSI4NSIgd2lkdGg9IjYwIiBoZWlnaHQ9IjMwIiByeD0iNSIgZmlsbD0iIzE0Mjg2QyIvPgo8cmVjdCB4PSI4NSIgeT0iOTAiIHdpZHRoPSIzMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzAwMDAwMCIvPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjMiIGZpbGw9IiNGRkZGRkYiLz4KPHRleHQgeD0iMTAwIiB5PSIxNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzI0MjQyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2Ftc3VuZzwvdGV4dD4KPC9zdmc+'
  },
  {
    name: 'Type-C Cable 2m',
    category: 'Electronics',
    qty: 50,
    unitPrice: 1500,
    costPrice: 800,
    minSellingPrice: 1000,
    maxSellingPrice: 2500,
    note: 'USB-C to USB-C charging cable',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik00MCAxMDBIMTYwIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iNCIvPgo8cmVjdCB4PSIzNSIgeT0iOTUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzAwMDAwMCIvPgo8cmVjdCB4PSIxNTUiIHk9Ijk1IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMwMDAwMDAiLz4KPHRleHQgeD0iMTAwIiB5PSIxNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzI0MjQyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VHlwZS1DPC90ZXh0Pgo8L3N2Zz4='
  },
  {
    name: 'Lightning Cable 1m',
    category: 'Electronics',
    qty: 40,
    unitPrice: 2000,
    costPrice: 1200,
    minSellingPrice: 1500,
    maxSellingPrice: 3200,
    note: 'iPhone Lightning charging cable',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik00MCAxMDBIMTYwIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iNCIvPgo8cmVjdCB4PSIzNSIgeT0iOTUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzAwMDAwMCIvPgo8cmVjdCB4PSIxNTUiIHk9Ijk1IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNGRkYwMDAiLz4KPHRleHQgeD0iMTAwIiB5PSIxNDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzI0MjQyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TGlnaHRuaW5nPC90ZXh0Pgo8L3N2Zz4='
  },
  {
    name: 'Wireless Charging Pad',
    category: 'Electronics',
    qty: 25,
    unitPrice: 5500,
    costPrice: 3500,
    minSellingPrice: 4000,
    maxSellingPrice: 8000,
    note: 'Qi wireless charging pad 15W',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDAiIGZpbGw9IiM0NzQ3NDciLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSIzMCIgZmlsbD0iIzM0MzQ0MCIvPgo8cGF0aCBkPSJNODUgMTAwSDEyMCIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjMiLz4KPHRleHQgeD0iMTAwIiB5PSIxNTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzI0MjQyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+V2lyZWxlc3M8L3RleHQ+Cjwvc3ZnPg=='
  },
  {
    name: 'Car Phone Holder',
    category: 'Electronics',
    qty: 22,
    unitPrice: 3200,
    costPrice: 2000,
    minSellingPrice: 2400,
    maxSellingPrice: 4800,
    note: 'Dashboard phone mount holder',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHg9IjgwIiB5PSI2MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMjQyNDI0Ii8+CjxyZWN0IHg9Ijg1IiB5PSI3MCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMDAwMDAwIi8+CjxyZWN0IHg9IjkwIiB5PSI4MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjODc4Nzg3Ii8+CjxyZWN0IHg9IjcwIiB5PSIxMzAiIHdpZHRoPSI2MCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzM0MzQ0MCIvPgo8dGV4dCB4PSIxMDAiIHk9IjE2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjMjQyNDI0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Ib2xkZXI8L3RleHQ+Cjwvc3ZnPg=='
  },
  {
    name: 'Screen Protector Tempered Glass',
    category: 'Electronics',
    qty: 60,
    unitPrice: 1200,
    costPrice: 600,
    minSellingPrice: 800,
    maxSellingPrice: 2000,
    note: '9H tempered glass screen protector',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHg9IjYwIiB5PSI3MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjBGNEY2IiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIvPgo8cmVjdCB4PSI3MCIgeT0iODAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzg3ODc4NyIvPgo8Y2lyY2xlIGN4PSI5NSIgY3k9Ijk1IiByPSI1IiBmaWxsPSIjMDAwMDAwIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiMyNDI0MjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNjcmVlbjwvdGV4dD4KPC9zdmc+'
  }
]

export async function seedData() {
  try {
    // Check if user is authenticated
    if (!auth.currentUser) {
      throw new Error('User must be authenticated to seed data')
    }

    console.log('Starting data seeding...')

    // Seed categories first
    console.log('Seeding categories...')
    for (const category of sampleCategories) {
      try {
        await addCategory(category)
        console.log(`✓ Added category: ${category.name}`)
      } catch (error) {
        console.log(`⚠ Category ${category.name} might already exist`)
      }
    }

    // Wait a bit for categories to be available
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Seed products
    console.log('Seeding products...')
    for (const product of sampleProducts) {
      try {
        await addInventory(product)
        console.log(`✓ Added product: ${product.name}`)
      } catch (error) {
        console.log(`⚠ Product ${product.name} might already exist`)
      }
    }

    console.log('✅ Data seeding completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   - ${sampleCategories.length} categories`)
    console.log(`   - ${sampleProducts.length} products`)
    console.log(`   - ${sampleProducts.filter(p => p.category === 'Footwear').length} shoes`)
    console.log(`   - ${sampleProducts.filter(p => p.category === 'Electronics').length} phone accessories`)

    return {
      success: true,
      categories: sampleCategories.length,
      products: sampleProducts.length
    }
  } catch (error) {
    console.error('❌ Error seeding data:', error)
    throw error
  }
}

// Function to clear all data (for testing)
export async function clearAllData() {
  // This would require implementing delete functions for categories and inventory
  console.log('Clear all data function not implemented yet')
}

// Export the sample data for reference
export { sampleCategories, sampleProducts }
