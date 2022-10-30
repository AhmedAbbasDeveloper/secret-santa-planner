import { model, Schema } from 'mongoose';

const groupSchema = new Schema({
  name: String,
  budget: Number,
});

export default model('Group', groupSchema);
