import moment from 'moment';

import Student from '../models/Student';
import Checkin from '../schemas/Checkin';

class EnrollmentController {
  async store(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student || student.cancelled_at !== null) {
      return res.status(400).json({ error: 'Student does not exists' });
    }

    const sevenDays = moment(new Date())
      .subtract(7, 'days')
      .toDate();

    const checkinStudentWeek = await Checkin.find({
      student_id: req.params.id,
    })
      .sort('createdAt')
      .where('createdAt')
      .gte(sevenDays);

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

    const checkins = await Checkin.find({
      student_id: student.id,
    }).sort({ createdAt: 'desc' });

    return res.json(checkins);
  }
}

export default new EnrollmentController();
