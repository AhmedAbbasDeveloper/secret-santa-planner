import { model, Schema } from 'mongoose';

const participantSchema = new Schema({
  name: String,
  giftee: String,
  gifter: String,
  choices: [String],
  secretSantagroup: Schema.Types.ObjectID,
});

export default model('Participant', participantSchema);
