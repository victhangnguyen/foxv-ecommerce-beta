const paymentConstants = {
  PAYMENT_METHOD: {
    CASH: 'cash', // paid at store
    COD: 'cod', // paid at delivery (cash on delivery)
    VNPAY: 'vnpay', // paid by Vn PAY
    MOMO: 'momo', // paid by Momo
    PAYPAL: 'paypal', // paid by Paypal
    ZALO_PAY: 'zalopay', // paid by Zalo PAY
  },
  PAYMENT_STATUS: {
    PENDING: 'pending', // payment is pending
    PAID: 'paid', // payment has been made
    CANCELLED: 'cancelled', // payment has been cancelled
  },
};

export default paymentConstants;
