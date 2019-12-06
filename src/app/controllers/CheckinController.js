import * as Yup from 'yup';
import { Op } from 'sequelize';
import { parseISO, addMonths, format, endOfDay, subDays } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Student from '../models/Student';
import Checkin from '../models/Checkin';

class EnrollmentController {
  async store(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student || student.cancelled_at !== null) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const checkinStudentWeek = await Checkin.findAll({
      where: {
        student_id: req.params.id,
        created_at: {
          [Op.between]: [subDays(new Date(), 7), new Date()],
        },
      },
    });

    if (checkinStudentWeek.length >= 5) {
      return res
        .status(401)
        .json({ error: 'Student already has 5 check-ins within last 7 days' });
    }

    const checkin = await Checkin.create({
      student_id: student.id,
    });

    return res.json(checkin);
  }

  async index(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student || student.cancelled_at !== null) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const checkins = await Checkin.findAll({
      where: { student_id: student.id, cancelled_at: null },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'created_at'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
        },
      ],
    });

    return res.json(checkins);
  }
}

export default new EnrollmentController();
