import mongoose from 'mongoose';
//! imp Libraries
import Logging from '../library/Logging.js';
export async function execWithTransaction(sessionCallbackFn) {
  //! session: callback
  const session = await mongoose.startSession();
  session.startTransaction(); //! error will be throwed by Promise.rejected
  try {
    const result = await sessionCallbackFn(session); //! callback with emmit session

    //! Commit the database's changes
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    Logging.error('Transaction Error: ' + error);
    //! Re-throw error to outside
    throw error;
  } finally {
    session.endSession();
  }
}
