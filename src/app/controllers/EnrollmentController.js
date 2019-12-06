import * as Yup from 'yup';
import { parseISO, addMonths, endOfDay } from 'date-fns';

import Student from '../models/Student';
import Plan from '../models/Plan';
import Enrollment from '../models/Enrollment';

import WelcomeMail from '../jobs/WelcomeMail';
import Queue from '../../lib/Queue';

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

    await Queue.add(WelcomeMail.key, {
      plan,
      student,
      end_date,
    });

    return res.json(enrollment);
  }

  async index(req, res) {
    const enrollments = await Enrollment.findAll({
      where: { cancelled_at: null },
      order: ['end_date', 'id'],
      attributes: ['id', 'start_date', 'end_date'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });

    return res.json(enrollments);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      enrollment_id: Yup.number().required(),
      student_id: Yup.number(),
      plan_id: Yup.number(),
      start_date: Yup.date().when('plan_id', (plan_id, field) =>
        plan_id ? field.required() : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const enrollment = await Enrollment.findByPk(req.body.enrollment_id);

    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment does not exists!' });
    }

    const student = await Student.findByPk(req.body.student_id);

    if (!student || student.cancelled_at !== null) {
      return res.status(400).json({ error: 'Student does not exists!' });
    }

    const plan = await Plan.findByPk(req.body.plan_id);

    if (!plan || plan.cancelled_at !== null) {
      return res.status(400).json({ error: 'Plan does not exists!' });
    }

    const { duration } = plan;

    const { start_date } = req.body;

    const end_date = await addMonths(endOfDay(parseISO(start_date)), duration);

    await enrollment.update({
      student_id: req.body.student_id,
      plan_id: req.body.plan_id,
      start_date,
      end_date,
      price: plan.price,
    });

    return res.json({ enrollment });
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment || enrollment.cancelled_at !== null) {
      return res
        .status(400)
        .json({ error: 'Enrollment does not exists or is already cancelled' });
    }

    enrollment.cancelled_at = new Date();

    await enrollment.save();

    return res.json(enrollment);
  }
}

export default new EnrollmentController();
