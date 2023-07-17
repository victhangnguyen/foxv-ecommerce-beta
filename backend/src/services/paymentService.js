import crypto from 'crypto';
import dateFormat from 'dateformat';
import moment from 'moment';
import queryString from 'qs';
import config from '../config/index.js';
//! Utils
import { sortObject } from '../utils/sort.js';

const {
  vnpayment: { vnpHashSecret, vnpTmnCode, vnpUrl },
} = config.payment;

function createPaymentUrl(
  ipAddr,
  apiUrl,
  clientUrl,
  orderId,
  orderPayAmount,
  language = 'vn',
  bankCode = ''
) {
  const returnUrl = `${apiUrl}/api/payment/vnpay/vnpay-return/`;

  let date = new Date();

  let createDate = moment(date).format('YYYYMMDDHHmmss');

  // var ipAddr =
  // req.headers['x-forwarded-for'] ||
  // req.connection.remoteAddress ||
  // req.socket.remoteAddress ||
  // req.connection.socket.remoteAddress;

  const tmnCode = vnpTmnCode;
  const secretKey = vnpHashSecret;
  let vnp_Url = vnpUrl;
  // const returnUrl = vnpReturnUrl;

  // let orderId = orderData._id;
  // let amount = orderData.total;

  const txnRef = dateFormat(date, 'HHmmss');

  // var bankCode = req.body.bankCode;
  // let bankCode = 'NCB';

  // var orderInfo = req.body.orderDescription;
  // let orderInfo = `Foxv - Số tiền cần thanh toán: ${amount}`;
  // var orderType = req.body.orderType;
  let orderType = 200000;
  // var locale = req.body.language;
  // if (locale === null || locale === '') {
  //   locale = 'vn';
  // }

  let locale = 'vn';
  if (language && ['vn', 'en'].indexOf(language) >= 0) {
    locale = language;
  }

  // vnp_Amount
  // vnp_BankCode
  // vnp_OrderInfo
  // vnp_PayDate
  // vnp_ResponseCode
  // vnp_TmnCode
  // vnp_TransactionNo
  // vnp_TransactionStatus
  // vnp_TxnRef
  // vnp_SecureHash

  var currCode = 'VND';
  var vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';

  vnp_Params['vnp_Amount'] = (orderPayAmount * 100).toString();

  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params['vnp_TmnCode'] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params['vnp_CurrCode'] = currCode;

  // vnp_Params['vnp_TxnRef'] = orderId; //! std
  vnp_Params['vnp_TxnRef'] = txnRef;

  // vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderInfo'] = JSON.stringify({ orderId, clientUrl });
  vnp_Params['vnp_Locale'] = locale;

  vnp_Params['vnp_OrderType'] = orderType;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;

  vnp_Params = sortObject(vnp_Params);

  var signData = queryString.stringify(vnp_Params, { encode: false });

  var hmac = crypto.createHmac('sha512', secretKey);
  var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  vnp_Params['vnp_SecureHash'] = signed;

  vnp_Url += '?' + queryString.stringify(vnp_Params, { encode: false });

  return vnp_Url;
}

function signVnp(vnpParams) {
  let vnp_Params = { ...vnpParams };

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  let secretKey = vnpHashSecret;

  let signData = queryString.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac('sha512', secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  return signed;
}

/*
checkPaymentStatus
*/

async function checkPaymentStatus(vnpParams) {
  let vnp_Params = { ...vnpParams };
  const secureHash = vnp_Params['vnp_SecureHash'];

  const signed = signVnp(vnp_Params);

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    const amount = vnp_Params['vnp_Amount'];
    const bankCode = vnp_Params['vnp_BankCode'];
    const cardType = vnp_Params['vnp_CardType'];
    const { orderId, clientUrl } = JSON.parse(
      Object.keys(queryString.parse(vnp_Params['vnp_OrderInfo']))[0]
    );
    const payDate = vnp_Params['vnp_PayDate']; // yyyyMMddHHmmss
    const responseCode = vnp_Params['vnp_ResponseCode'];
    const tmnCode = vnp_Params['vnp_TmnCode'];
    const transactionNo = vnp_Params['vnp_TransactionNo'];
    const transactionStatus = vnp_Params['vnp_TransactionStatus'];
    const txnRef = vnp_Params['vnp_TxnRef'];
    const bankTranNo = vnp_Params['vnp_BankTranNo'];

    let isSuccess = true;
    let message = 'Payment success';

    if (transactionStatus !== '00') {
      // res.render('success', { code: '97' });
      isSuccess = false;
      message = 'Payment failed';
    }

    // res.render('success', { code: vnp_Params['vnp_ResponseCode'] });
    return {
      isSuccess,
      data: {
        amount,
        bankCode,
        cardType,
        orderId,
        payDate,
        responseCode,
        tmnCode,
        transactionNo,
        transactionStatus,
        txnRef,
        bankTranNo,
        clientUrl,
      },
      message,
    };
  } else {
    return {
      isSuccess: false,
      message: 'Invalid secure hash',
    };
  }
}

export default {
  createPaymentUrl,
  checkPaymentStatus,
};
