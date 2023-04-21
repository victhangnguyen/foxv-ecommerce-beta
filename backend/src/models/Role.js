import mongoose from 'mongoose';

// Define the [Role Schema]
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 2,
    maxLength: 256,
    text: true,
  },
  description: {
    type: String,
  },
});

const Role = mongoose.model('Role', roleSchema);

export default Role;
