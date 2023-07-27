import querystring from 'qs';
import crypto from 'crypto';
import dateFormat from 'dateformat';
import config from '../config/index.js';
import paymentService from '../services/paymentService.js';
//! imp Constants
import constants from '../constants/index.js';
import Order from '../models/Order.js';

/*
  vnpayReturn
*/
export async function getVnpayReturn(req, res, next) {
  try {
    const result = await paymentService.checkPaymentStatus(req.query);

    console.log('__Debugger__payment\n:::getVnpayReturn :::result: ', result, '\n');

    const order = await Order.findById(result.data.orderId);

    let message;
    if (result.isSuccess) {
      console.log('Success payment - payDate: ', result.data.payDate);
      //! update Order -> status, transactionNo, bankTranNo
      order.status = constants.order.STATUS.PAID;
      order.transactionNo = result.data.transactionNo;
      order.bankTranNo = result.data.bankTranNo;

      message = 'Thanh toán thành công';
    } else {
      message = 'Thanh toán thất bại';
      if (result.data.responseCode == 24) {
        order.status = constants.order.STATUS.CANCELED;
      }
    }
    
    await Order.updateOne({ _id: order._id }, order);

    // if (result.isSuccess) {
    //   const paidDate = new Date(
    //     Number.parseInt(result.data.payDate.substring(0, 4)),
    //     Number.parseInt(result.data.payDate.substring(4, 6)),
    //     Number.parseInt(result.data.payDate.substring(6, 8)),
    //     Number.parseInt(result.data.payDate.substring(8, 10)),
    //     Number.parseInt(result.data.payDate.substring(10, 12)),
    //     Number.parseInt(result.data.payDate.substring(12, 14))
    //   );

    //   const order = await Order.findById(result.data.orderId);
    //   if (order.total === result.data.amount / 100) {
    //     // order.status = constants.ORDER.PAYMENT_STATUS.PAID;
    //     order.paymentStatus = constants.ORDER.PAYMENT_STATUS.PAID;
    //     await Order.updateOne({ _id: order._id }, order);
    //   }

    //   const payment = new Payment({
    //     _id: new mongoose.Types.ObjectId(),
    //     order: result.data.orderId,
    //     amount: result.data.amount,
    //     paidDate,
    //     desc: `
    //       Mã giao dịch VNPAY: ${result.data.transactionNo}
    //       Số tiền: ${result.data.amount}
    //       Mã Ngân hàng thanh toán: ${result.data.bankCode}
    //       Mã giao dịch tại Ngân hàng: ${result.data.bankTranNo}
    //       Loại tài khoản/thẻ khách hàng sử dụng: ${result.data.cardType}
    //     `,
    //   });

    //   await payment.save();
    //   message = 'Thanh toán thành công';
    // } else {
    //   message = 'Thanh toán thất bại';
    // }

    //

    console.log('__Debugger__payment\n:::getVnpayReturn :::order: ', order, '\n');
    res.send(`
      <script>
        alert('${message}');
      window.open('${result.data.clientUrl}/users/${order.user._id}/orders/${result.data.orderId}', '_self', '')
      </script>
    `);
  } catch (error) {
    console.log('Error: ', error);
  }
}

// Code IPN URL
// Đây là địa chỉ để nhận kết quả thanh toán từ VNPAY. Kết nối hiện tại sử dụng phương thức GET
// Trên URL VNPAY gọi về có mang thông tin thanh toán để căn cứ vào kết quả đó Website TMĐT xử lý các bước tiếp theo
// (ví dụ: cập nhật kết quả thanh toán vào Database …)
/*
vnpayIpn
*/
export async function getVnpayIpn(req, res, next) {
  try {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];

    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    // let config = require('config');
    let secretKey = config.get('vnp_HashSecret');

    let signData = querystring.stringify(vnp_Params, { encode: false });

    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

    let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
    //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
    //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

    let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
    if (secureHash === signed) {
      //kiểm tra checksum
      if (checkOrderId) {
        if (checkAmount) {
          if (paymentStatus == '0') {
            //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
            if (rspCode == '00') {
              //thanh cong
              //paymentStatus = '1'
              // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
              res.status(200).json({ RspCode: '00', Message: 'Success' });
            } else {
              //that bai
              //paymentStatus = '2'
              // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
              res.status(200).json({ RspCode: '00', Message: 'Success' });
            }
          } else {
            res.status(200).json({
              RspCode: '02',
              Message: 'This order has been updated to the payment status',
            });
          }
        } else {
          res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
        }
      } else {
        res.status(200).json({ RspCode: '01', Message: 'Order not found' });
      }
    } else {
      res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
    }
  } catch (error) {
    Logging.error('Error__ctrls__order: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}
