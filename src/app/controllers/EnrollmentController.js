import * as Yup from 'yup';
import { parseISO, addMonths, format, endOfDay } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Student from '../models/Student';
import Plan from '../models/Plan';
import Enrollment from '../models/Enrollment';

import Mail from '../../lib/Mail';

class EnrollmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Student.findByPk(req.body.student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const studentEnrolled = await Enrollment.findOne({
      where: { student_id: req.body.student_id, cancelled_at: null },
    });

    if (studentEnrolled) {
      return res.status(400).json({ error: 'Student is already enrolled' });
    }

    const plan = await Plan.findByPk(req.body.plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan does not exists' });
    }

    const { start_date } = req.body;

    const { duration, price } = plan;

    const end_date = await addMonths(endOfDay(parseISO(start_date)), duration);

    const enrollment = await Enrollment.create({
      student_id: student.id,
      plan_id: plan.id,
      start_date,
      end_date,
      price,
    });

    return res.json(enrollment);
  }
}

export default new EnrollmentController();
