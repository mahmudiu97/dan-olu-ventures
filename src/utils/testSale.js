import { addSale, getSales } from '../services/salesService'

// Test function to create a sample sale
export async function createTestSale() {
  try {
    const testSale = {
      customer: 'Test Customer',
      productId: 'test-product-id',
      productName: 'Test Product',
      quantity: 1,
      amount: 1000,
      unitPrice: 1000,
      discount: 0,
      deposit: 0,
      isCredit: false,
      paymentMethod: 'Cash',
      balance: 0
    }
    
    console.log('Creating test sale...')
    const result = await addSale(testSale)
    console.log('Test sale created successfully:', result)
    return result
  } catch (error) {
    console.error('Failed to create test sale:', error)
    throw error
  }
}

// Function to check if sales are being created
export async function checkSales() {
  try {
    const sales = await getSales()
    console.log('Total sales found:', sales.length)
    console.log('Sales:', sales)
    return sales
  } catch (error) {
    console.error('Failed to get sales:', error)
    throw error
  }
}
