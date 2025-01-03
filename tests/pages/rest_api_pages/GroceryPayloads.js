class GroceryPayloads {
    static generateToken(clientName)
    {
      return {
        clientName: clientName || `Client_${Date.now()}`,
        clientEmail: `test_${Date.now()}@example.com`,
       };
    }
  
    static addItem(productId) 
    {
      return { productId: productId || 4643, };
    }
  
    static updateCartItem(quantity) 
    {
      return { quantity: quantity || 1,};
    }
  
    static createOrder(cartId, customerName) 
    {
      if (!cartId) throw new Error('Cart ID is required to create an order.');
      return { cartId, customerName: customerName || 'Test User',};
    }
  
    static updateOrder(customerName) 
    {
      return { customerName: customerName || 'Updated User', };
    }
    
  }
  module.exports = { GroceryPayloads };