class GroceryPayloads {
  static generateTimestamp() {
    return Date.now();
  }

  static generateToken(clientName) {
    const timestamp = this.generateTimestamp();
    return {
      clientName: clientName || `Client_${timestamp}`,
      clientEmail: `test_${timestamp}@example.com`,
    };
  }

  static addItem(productId = 4643) {
    return { productId };
  }

  static updateCartItem(quantity = 1) {
    return { quantity };
  }

  static createOrder(cartId, customerName = 'Test User') {
    if (!cartId) throw new Error('Cart ID is required to create an order.');
    return { cartId, customerName };
  }

  static updateOrder(customerName = 'Updated User') {
    return { customerName };
  }
}

module.exports = { GroceryPayloads };
