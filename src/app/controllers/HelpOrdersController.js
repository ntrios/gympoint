import Student from '../models/Student';
import HelpOrders from '../schemas/HelpOrders';

class HelpOrdersController {
  async store(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student || student.cancelled_at !== null) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const question = await HelpOrders.create({
      student_id: student.id,
      question: req.body.question,
    });

    return res.json(question);
  }

  async index(req, res) {
    const { page = 1 } = req.query;
    const student = await Student.findByPk(req.params.id);

    if (!student || student.cancelled_at !== null) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const questions = await HelpOrders.find({
      student_id: student.id,
    })
      .sort({ createdAt: 'desc' })
      .skip((page - 1) * 10)
      .limit(10);

    return res.json(questions);
  }
}

export default new HelpOrdersController();
