//! imp Library
import Logging from '../library/Logging.js';

//! imp Models
import User from '../models/User.js';

export const fetchUsersByFilters = async (req, res, next) => {
  const { keyword, age, sort, order, page, perPage } = req.query;
  console.log('req.query: ', req.query);
  let match = {};

  const skip = (page - 1) * perPage;

  try {
    if (keyword) {
      match.$or = [
        { firstName: new RegExp(keyword, 'i') },
        { lastName: new RegExp(keyword, 'i') },
        { phoneNumber: new RegExp(keyword, 'i') },
      ];
    }

    const result = await User.aggregate([
      { $match: match },
      {
        $facet: {
          users: [{ $skip: skip }, { $limit: +perPage }],
          usersCount: [{ $count: 'count' }],
        },
      },
    ]);

    const users = result[0].users;
    const usersCount = result[0].usersCount[0]?.count || 0;

    res.status(200).json({ users, usersCount });
  } catch (error) {
    Logging.error('Error__ctrls__user: ' + error);
    const err = new Error(error);
    err.statusCode = 400; //! 500;
    return next(err);
  }
};

export const removeUser = async (req, res, next) => {
  console.log('__Debugger__user\n__removeUser__req.user: ', req.user, '\n');
  const userId = req.params.userId;

  try {
    //! delete database -> delete Files
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found!');
    }

    // const fileDir = path.join(fileHelper.rootDir, 'images', 'products');
    // const files = product.images;

    // const deletedFiles = await fileHelper.deleteFiles(fileDir, files);
    // Logging.info(deletedFiles);

    const response = await User.findByIdAndRemove(userId).exec();

    res.status(200).json(response);
  } catch (error) {
    Logging.error('Error__ctrls__user: ' + error);
    const err = new Error(error);
    err.statusCode = 400; //! 500;
    return next(err);
  }
};
