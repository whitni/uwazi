import mongoose from 'mongoose';
import instanceModel from 'api/odm';

const entitySchema = new mongoose.Schema({
  language: String,
  sharedId: String,
  title: String,
  template: {type: mongoose.Schema.Types.ObjectId, ref: 'templates'},
  file: {
    originalname: String,
    filename: String
  },
  attachments: [{
    originalname: String,
    filename: String
  }],
  creationDate: Number,
  fullText: {type: String, select: false},
  processed: Boolean,
  uploaded: Boolean,
  published: Boolean,
  metadata: mongoose.Schema.Types.Mixed,
  user: {
    username: String
  }
});

let Model = mongoose.model('entities', entitySchema);
export default instanceModel(Model);
