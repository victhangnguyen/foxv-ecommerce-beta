const orderConstants = {
  status: {
    PENDING: 'pending', // order created, waiting for confirm by admin or staff
    PAID: 'paid',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    COMPLETED: 'completed', // order has been delivered
    CANCELED: 'canceled', // order has been canceled
  },
  tabs: {
    ALL_ORDERS: 'all_orders',
    PENDING: 'pending',
    CANCELED: 'canceled',
    PAID: 'paid',
    COMPLETED: 'completed',
  },
  actionTypes: {
    DELETE_ORDER: 'DELETE_ORDER',
    DELETE_ORDERS: 'DELETE_ORDERS',
    DOWNLOAD_INVOICE: 'DOWNLOAD_INVOICE',
  },
};

export default orderConstants;
