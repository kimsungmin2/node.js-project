import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: false,
      default: 'FOR_SALE',
    },
    order: {
      type: Number,
    },
    doneAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
);

TodoSchema.virtual('todoId').get(function () {
  return this._id.toHexString();
});
TodoSchema.set('toJSON', {
  virtuals: true,
});

export default mongoose.model('Todo', TodoSchema);
