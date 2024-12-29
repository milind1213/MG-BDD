class GroceryPayloads {
    static generateTokenPayload(clientName)
    {
      return {
        clientName: clientName || `Client_${Date.now()}`,
        clientEmail: `test_${Date.now()}@example.com`,
       };
    }
  
    static addItemPayload(productId) 
    {
      return { productId: productId || 4643, };
    }
  
    static updateCartItemPayload(quantity) 
    {
      return { quantity: quantity || 1,};
    }
  
    static createOrderPayload(cartId, customerName) 
    {
      if (!cartId) throw new Error('Cart ID is required to create an order.');
      return { cartId, customerName: customerName || 'Test User',};
    }
  
    static updateOrderPayload(customerName) 
    {
      return { customerName: customerName || 'Updated User', };
    }
  }
  module.exports = { GroceryPayloads };