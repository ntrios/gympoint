import mongoose from 'mongoose';

const HelpOrdersSchema = new mongoose.Schema(
  {
    student_id: {
      type: Number,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
    },
    answerAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('HelpeOrders', HelpOrdersSchema);
