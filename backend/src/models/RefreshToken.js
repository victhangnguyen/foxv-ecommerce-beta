import mongoose from 'mongoose';

// Define the [RefreshToken Schema]
const refreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // reference to user model
  token: { type: String, required: true }, // random token string
  expiresAt: { type: Date }, // expiration date
});

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
export default RefreshToken;
