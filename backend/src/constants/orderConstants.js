const orderConstants = {
  STATUS: {
    PENDING: 'pending', // order created, waiting for confirm by admin or staff
    PAID: 'paid',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    COMPLETED: 'completed', // order has been delivered
    CANCELED: 'canceled', // order has been canceled
  },
};

export default orderConstants;
