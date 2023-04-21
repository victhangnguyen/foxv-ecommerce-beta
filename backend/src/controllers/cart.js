//! imp Library
import Logging from '../library/Logging.js';
//! imp Models
import Cart from '../models/Cart.js';

export async function getCart(req, res, next) {
  //! when signed-in successfull
  try {
    const cart = await Cart.findOne({ user: req.user, active: true });
    res.status(200).json({
      success: true,
      messsage: 'Fetch a Cart successful!',
      data: { cart },
    });
  } catch (error) {
    Logging.error('Error__ctrls__user: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}

export async function postCart(req, res, next) {
  const { cartItems } = req.body;

  try {
    const cart = await Cart.createOrUpdateCartByUserId(req.user._id, {
      cartItems: cartItems,
    });

    res.status(200).json({
      success: true,
      messsage: 'Fetch a Cart successful!',
      data: { cart },
    });
  } catch (error) {
    Logging.error('Error__ctrls__user: ' + error);
    const err = new Error(error);
    err.statusCode = 400;
    return next(err);
  }
}
