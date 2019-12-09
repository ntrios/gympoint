import HelpOrders from '../schemas/HelpOrders';
import Student from '../models/Student';

import AnswerStudentMail from '../jobs/AnswerStudentMail';
import Queue from '../../lib/Queue';

class HelpOrdersAnswersController {
  async store(req, res) {
    const question_id = await HelpOrders.findById(req.params.id);

    if (!question_id) {
      return res.status(400).json({ error: 'Question does not exists' });
    }

    const student = await Student.findByPk(question_id.student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const question = await HelpOrders.findByIdAndUpdate(
      question_id,
      {
        answer: req.body.answer,
        answerAt: new Date(),
      },
      { new: true }
    );

    await Queue.add(AnswerStudentMail.key, {
      student,
      question,
    });

    return res.json(question);
  }
}

export default new HelpOrdersAnswersController();
