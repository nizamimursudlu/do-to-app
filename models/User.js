const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  todo: [{ type: Types.ObjectId, ref: 'Todo' }],
});

module.exports = model('User', schema);
