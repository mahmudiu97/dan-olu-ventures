import { addCategory } from '../services/categoryService'
import { addInventory } from '../services/inventoryService'
import { auth } from '../services/firebase'

// Premium categories with professional descriptions
const categories = [
  {
    name: 'Footwear',
    description: 'Premium sneakers, running shoes, and athletic footwear',
    color: '#2563EB'
  },
  {
    name: 'Phone Accessories',
    description: 'Original chargers, cables, cases, and mobile accessories',
    color: '#059669'
  },
  {
    name: 'Electronics',
    description: 'Gadgets, audio devices, and tech accessories',
    color: '#7C3AED'
  },
  {
    name: 'Fashion',
    description: 'Trendy clothing, watches, and fashion accessories',
    color: '#DB2777'
  },
  {
    name: 'Sports & Fitness',
    description: 'Sports equipment, fitness gear, and workout accessories',
    color: '#EA580C'
  },
  {
    name: 'Bags & Accessories',
    description: 'Backpacks, handbags, and travel accessories',
    color: '#0891B2'
  }
]

// High-quality products with realistic images
const products = [
  // Premium Footwear
  {
    name: 'Nike Air Jordan 1 Retro High',
    category: 'Footwear',
    qty: 8,
    unitPrice: 85000,
    costPrice: 65000,
    minSellingPrice: 75000,
    maxSellingPrice: 95000,
    note: 'Iconic basketball sneakers with premium leather upper',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkY2QjZCIi8+CjxwYXRoIGQ9Ik02MCA4MEgyNDBWMjIwSDYwVjgwWiIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNOCAxNDBIMjkyVjE2MEg4VjE0MFoiIGZpbGw9IiNGRjAwMDAiLz4KPHBhdGggZD0iTTgwIDEyMEgyMjBWMTYwSDgwVjEyMFoiIGZpbGw9IiMwMDAwMDAiLz4KPGNpcmNsZSBjeD0iMTUwIiBjeT0iMTQwIiByPSIyMCIgZmlsbD0iI0ZGRjAwMCIvPgo8dGV4dCB4PSIxNTAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIEJvbGQiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5pa2UgQWlyIEpvcmRhbiAxPC90ZXh0Pgo8L3N2Zz4='
  },
  {
    name: 'Adidas Yeezy Boost 350 V2',
    category: 'Footwear',
    qty: 12,
    unitPrice: 120000,
    costPrice: 95000,
    minSellingPrice: 100000,
    maxSellingPrice: 140000,
    note: 'Limited edition lifestyle sneakers with Primeknit upper',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjVGNUY3Ii8+CjxwYXRoIGQ9Ik02MCA5MEgyNDBWMjEwSDYwVjkwWiIgZmlsbD0iIzMzMzMzMyIvPgo8cGF0aCBkPSJNMTAwIDEzMDBIMjAwVjE3MEgxMDBWMTMwWiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNODAgMTUwSDIyMFYxNzBIODBWMTUwWiIgZmlsbD0iI0ZGRkZGRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIEJvbGQiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFkaWRhcyBZZWV6eSAzNTA8L3RleHQ+Cjwvc3ZnPg=='
  },
  {
    name: 'New Balance 574 Core',
    category: 'Footwear',
    qty: 15,
    unitPrice: 45000,
    costPrice: 32000,
    minSellingPrice: 35000,
    maxSellingPrice: 55000,
    note: 'Classic retro running shoes with ENCAP midsole',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjRGNEY2Ii8+CjxwYXRoIGQ9Ik02MCA4MEgyNDBWMjIwSDYwVjgwWiIgZmlsbD0iI0Y3NTA1MiIvPgo8cGF0aCBkPSJNODAgMTIwSDIyMFYxNjBIODBWMTIwWiIgZmlsbD0iIzJEMjQyRCIvPgo8cGF0aCBkPSJNMTAwIDE0MEgyMDBWMTYwSDEwMFYxNDBaIiBmaWxsPSIjRkYwMDAwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjgwIiBmb250LWZhbWlseT0iQXJpYWwgQm9sZCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzAwMDAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TmV3IEJhbGFuY2UgNTc0PC90ZXh0Pgo8L3N2Zz4='
  },

  // Premium Phone Accessories
  {
    name: 'Apple MagSafe Charger',
    category: 'Phone Accessories',
    qty: 20,
    unitPrice: 25000,
    costPrice: 18000,
    minSellingPrice: 20000,
    maxSellingPrice: 30000,
    note: 'Official Apple MagSafe wireless charger 15W',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjE1MCIgcj0iNjAiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iMTUwIiBjeT0iMTUwIiByPSI0NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjMiLz4KPGNpcmNsZSBjeD0iMTUwIiBjeT0iMTUwIiByPSIzMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiLz4KPHBhdGggZD0iTTE1MCAxMjBWMTgwTTEyMCAxNTBIMTgwTTE1MCAxMjBMMTgwIDE1MEwxNTAgMTgwTDEyMCAxNTBaIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIxNTAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIEJvbGQiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1hZ1NhZmUgQ2hhcmdlcjwvdGV4dD4KPC9zdmc+'
  },
  {
    name: 'Samsung 25W Fast Charger',
    category: 'Phone Accessories',
    qty: 25,
    unitPrice: 8500,
    costPrice: 5500,
    minSellingPrice: 6500,
    maxSellingPrice: 10000,
    note: 'Original Samsung Super Fast Charging 25W adapter',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjkwIiB5PSI4MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxNDAiIHJ4PSIxNSIgZmlsbD0iIzE4MjE4MSIvPgo8cmVjdCB4PSIxMDUiIHk9IjYwIiB3aWR0aD0iOTAiIGhlaWdodD0iMzAiIHJ4PSIxMCIgZmlsbD0iIzI0MjQyNCIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIxNTAiIHI9IjEyIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0xMzAgMTUwSDE3ME0xNTAgMTMwVjE3ME0xMzAgMTUwTDE3MCAxNTAiIHN0cm9rZT0iIzI0MjQyNCIgc3Ryb2tlLXdpZHRoPSIzIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjgwIiBmb250LWZhbWlseT0iQXJpYWwgQm9sZCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzAwMDAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2Ftc3VuZyAyNVcgQ2hhcmdlcjwvdGV4dD4KPC9zdmc+'
  },
  {
    name: 'Anker PowerCore 10000',
    category: 'Phone Accessories',
    qty: 30,
    unitPrice: 12000,
    costPrice: 8000,
    minSellingPrice: 9000,
    maxSellingPrice: 15000,
    note: 'Premium 10000mAh portable power bank with PowerIQ',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjcwIiB5PSI5MCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMjAiIHJ4PSIxNSIgZmlsbD0iIzMzMzMzMyIvPgo8cmVjdCB4PSI5MCIgeT0iMTEwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiByeD0iMTAiIGZpbGw9IiM1NTU1NTUiLz4KPGNpcmNsZSBjeD0iMTIwIiBjeT0iMTUwIiByPSI4IiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjE4MCIgY3k9IjE1MCIgcj0iOCIgZmlsbD0iI0ZGRkZGRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIEJvbGQiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFua2VyIFBvd2VyQ29yZSAxMDAwMDwvdGV4dD4KPC9zdmc+'
  },

  // Electronics
  {
    name: 'Sony WH-1000XM4 Headphones',
    category: 'Electronics',
    qty: 10,
    unitPrice: 65000,
    costPrice: 48000,
    minSellingPrice: 55000,
    maxSellingPrice: 75000,
    note: 'Industry-leading noise canceling wireless headphones',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkZGRkZGIi8+CjxlbGxpcHNlIGN4PSI4MCIgY3k9IjE1MCIgcng9IjMwIiByeT0iNDAiIGZpbGw9IiMwMDAwMDAiLz4KPGVsbGlwc2UgY3g9IjIyMCIgY3k9IjE1MCIgcng9IjMwIiByeT0iNDAiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iTTgwIDE1MEgyMjAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI4Ii8+CjxjaXJjbGUgY3g9IjgwIiBjeT0iMTUwIiByPSIxMiIgZmlsbD0iIzMzMzMzMyIvPgo8Y2lyY2xlIGN4PSIyMjAiIGN5PSIxNTAiIHI9IjEyIiBmaWxsPSIjMzMzMzMzIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjgwIiBmb250LWZhbWlseT0iQXJpYWwgQm9sZCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzAwMDAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U29ueSBXSC0xMDAwWE00PC90ZXh0Pgo8L3N2Zz4='
  },
  {
    name: 'JBL Flip 6 Speaker',
    category: 'Electronics',
    qty: 18,
    unitPrice: 28000,
    costPrice: 20000,
    minSellingPrice: 22000,
    maxSellingPrice: 35000,
    note: 'Portable waterproof Bluetooth speaker with powerful bass',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjE1MCIgcj0iNTAiIGZpbGw9IiMwMDAwMDAiLz4KPGNpcmNsZSBjeD0iMTUwIiBjeT0iMTUwIiByPSI0MCIgZmlsbD0iIzJEMjQyRCIvPgo8Y2lyY2xlIGN4PSIxMzAiIGN5PSIxMzAiIHI9IjgiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iMTcwIiBjeT0iMTMwIiByPSI4IiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjEzMCIgY3k9IjE3MCIgcj0iOCIgZmlsbD0iI0ZGRkZGRiIvPgo8Y2lyY2xlIGN4PSIxNzAiIGN5PSIxNzAiIHI9IjgiIGZpbGw9IiNGRkZGRkYiLz4KPHRleHQgeD0iMTUwIiB5PSIyODAiIGZvbnQtZmFtaWx5PSJBcmlhbCBCb2xkIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDAwMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5KQkwgRmxpcCA2PC90ZXh0Pgo8L3N2Zz4='
  },

  // Fashion
  {
    name: 'Michael Kors Watch',
    category: 'Fashion',
    qty: 12,
    unitPrice: 45000,
    costPrice: 32000,
    minSellingPrice: 35000,
    maxSellingPrice: 55000,
    note: 'Luxury analog watch with stainless steel bracelet',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkZGRkZGIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjE1MCIgcj0iNTAiIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iMTUwIiBjeT0iMTUwIiByPSI0NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjMiLz4KPGNpcmNsZSBjeD0iMTUwIiBjeT0iMTUwIiByPSIzNSIgZmlsbD0iIzAwMDAwMCIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSI4MCIgcj0iNCIgZmlsbD0iI0ZGRkZGRiIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSIyMjAiIHI9IjQiIGZpbGw9IiNGRkZGRkYiLz4KPHBhdGggZD0iTTE1MCAxMjBWMTgwTTEyMCAxNTBIMTgwTTE1MCAxMjBMMTgwIDE1MEwxNTAgMTgwTDEyMCAxNTBaIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIvPgo8dGV4dCB4PSIxNTAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIEJvbGQiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1pY2hhZWwgS29ycyBXYXRjaDwvdGV4dD4KPC9zdmc+'
  },
  {
    name: 'Ray-Ban Aviator Sunglasses',
    category: 'Fashion',
    qty: 20,
    unitPrice: 35000,
    costPrice: 25000,
    minSellingPrice: 28000,
    maxSellingPrice: 42000,
    note: 'Classic aviator sunglasses with gold frame',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0wIDE1MEgzMDBWMTcwSDBWMTUwWiIgZmlsbD0iI0Y5RkYwMCIvPgo8cGF0aCBkPSJNMTAwIDE0MEgxNTBWMTcwSDEwMFYxNDBaIiBmaWxsPSIjMjQyNDI0Ii8+CjxwYXRoIGQ9Ik0xNTAgMTQwSDIwMFYxNzBIMTUwVjE0MFoiIGZpbGw9IiMyNDI0MjQiLz4KPHBhdGggZD0iMTUwIDE0MEgxNTBWMTcwSDE1MFYxNDBaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9IjEwMCAxNTBIMjAwVjE2MEgxMDBWMTUwWiIgZmlsbD0iI0ZGRkZGRiIvPgo8dGV4dCB4PSIxNTAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIEJvbGQiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlJheS1CYW4gQXZpYXRvcjwvdGV4dD4KPC9zdmc+'
  },

  // Sports & Fitness
  {
    name: 'Nike Dri-FIT Training Shirt',
    category: 'Sports & Fitness',
    qty: 25,
    unitPrice: 8500,
    costPrice: 5500,
    minSellingPrice: 6500,
    maxSellingPrice: 10000,
    note: 'Moisture-wicking performance training shirt',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjgwIiB5PSI4MCIgd2lkdGg9IjE0MCIgaGVpZ2h0PSIxNDAiIHJ4PSIxMCIgZmlsbD0iI0ZGMDAwMCIvPgo8cGF0aCBkPSJNMTAwIDEyMEgxNjBWMjAwSDEwMFYxMjBaIiBmaWxsPSIjMDAwMDAwIi8+CjxwYXRoIGQ9IjExMCAxMDBIMTgwVjExMEgxMTBWMTAwWiIgZmlsbD0iIzAwMDAwMCIvPgo8dGV4dCB4PSIxNTAiIHk9IjI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIEJvbGQiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMwMDAwMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5pa2UgRHJpLUZJVCBTGmlydDwvdGV4dD4KPC9zdmc+'
  },
  {
    name: 'Adidas Gym Duffel Bag',
    category: 'Sports & Fitness',
    qty: 15,
    unitPrice: 12000,
    costPrice: 8000,
    minSellingPrice: 9000,
    maxSellingPrice: 15000,
    note: 'Spacious gym bag with multiple compartments',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjcwIiB5PSI5MCIgd2lkdGg9IjE2MCIgaGVpZ2h0PSIxMjAiIHJ4PSIxNSIgZmlsbD0iIzAwMDAwMCIvPgo8cmVjdCB4PSI5MCIgeT0iMTEwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiByeD0iMTAiIGZpbGw9IiM0NzQ3NDciLz4KPHBhdGggZD0iTTUwIDEwMFYxMzBIMjUwVjEzMFA1MCAxMDBaIiBmaWxsPSIjMDAwMDAwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjgwIiBmb250LWZhbWlseT0iQXJpYWwgQm9sZCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzAwMDAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QWRpZGFzIEd5bSBCYWc8L3RleHQ+Cjwvc3ZnPg=='
  },

  // Bags & Accessories
  {
    name: 'Samsonite Laptop Backpack',
    category: 'Bags & Accessories',
    qty: 18,
    unitPrice: 18000,
    costPrice: 12000,
    minSellingPrice: 14000,
    maxSellingPrice: 22000,
    note: 'Professional laptop backpack with USB charging port',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjgwIiB5PSI4MCIgd2lkdGg9IjE0MCIgaGVpZ2h0PSIxNDAiIHJ4PSIxNSIgZmlsbD0iIzJEMjQyRCIvPgo8cmVjdCB4PSI5NSIgeT0iMTAwIiB3aWR0aD0iMTEwIiBoZWlnaHQ9IjgwIiByeD0iMTAiIGZpbGw9IiM0NzQ3NDciLz4KPHBhdGggZD0iTTgwIDEyMEgyMjBWMTQwSDgwVjEyMFoiIGZpbGw9IiMwMDAwMDAiLz4KPHBhdGggZD0iMTIwIDEwMFYxNDBIMjAwVjEwMEgxMjBaIiBmaWxsPSIjMDAwMDAwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjgwIiBmb250LWZhbWlseT0iQXJpYWwgQm9sZCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzAwMDAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2Ftc29uaXRlIExhcHRvcCBCYWNrcGFjazwvdGV4dD4KPC9zdmc+'
  },
  {
    name: 'Leather Belt - Premium Quality',
    category: 'Bags & Accessories',
    qty: 30,
    unitPrice: 5500,
    costPrice: 3500,
    minSellingPrice: 4000,
    maxSellingPrice: 7000,
    note: 'Genuine leather belt with classic buckle',
    image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik00MCAxNDBIMjYwVjE2MEg0MFYxNDBaIiBmaWxsPSIjOEI0NTEzIi8+CjxyZWN0IHg9IjIwIiB5PSIxMzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcng9IjUiIGZpbGw9IiM4QjQ1MTMiLz4KPHJlY3QgeD0iMjQwIiB5PSIxMzAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcng9IjUiIGZpbGw9IiM4QjQ1MTMiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSIxNTAiIHI9IjUiIGZpbGw9IiNGRkQ3MDAiLz4KPGNpcmNsZSBjeD0iMjYwIiBjeT0iMTUwIiByPSI1IiBmaWxsPSIjRkZENzAwIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMjgwIiBmb250LWZhbWlseT0iQXJpYWwgQm9sZCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzAwMDAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TGVhdGhlciBCZWx0PC90ZXh0Pgo8L3N2Zz4='
  }
]

// Premium seeder function
export async function seedQualityData() {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to seed data')
  }

  console.log('🌟 Starting quality data seeding...')
  
  try {
    // Seed categories first
    console.log('📁 Seeding premium categories...')
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
    console.log('📦 Seeding premium products...')
    for (const product of products) {
      try {
        await addInventory(product)
        console.log(`✅ Product added: ${product.name}`)
      } catch (error) {
        console.log(`⚠️ Product ${product.name} may already exist:`, error.message)
      }
    }

    console.log('🎉 Quality data seeding completed successfully!')
    console.log(`📊 Seeded ${categories.length} premium categories and ${products.length} quality products`)
    
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
export function runQualitySeeder() {
  console.log('🚀 Starting quality seeder...')
  seedQualityData()
    .then(result => {
      console.log('✅ Quality seeder completed:', result)
      alert(`Quality seeding completed! Added ${result.categories} categories and ${result.products} premium products.`)
    })
    .catch(error => {
      console.error('❌ Quality seeder failed:', error)
      alert('Quality seeding failed: ' + error.message)
    })
}

// Make available globally for browser console
if (typeof window !== 'undefined') {
  window.seedQualityData = seedQualityData
  window.runQualitySeeder = runQualitySeeder
}
