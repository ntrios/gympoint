import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import Student from '../models/Student';

import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    let subject;

    const schema = Yup.object().shape({
      admin: Yup.boolean(),
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().when('admin', (admin, field) =>
        admin ? field.required() : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { admin, email, password } = req.body;

    if (admin) {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'User not found.' });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Password does not match' });
      }
    } else if (!admin) {
      const user = await Student.findOne({ where: { email } });

      if (!user) {
        return res.status(401).json({ error: 'Student not found.' });
      }

      const { id } = user;

      // console.log(user.id);
      // console.log(user.name);
      // console.log(user.email);

      // this.subject = user;
      // console.log(user);
      // console.log(this.subject);
    }
    console.log(this.id);

    // console.log(subject);
    // const { id, name } = subject;

    // // get access data user
    // // const { email, password } = req.body;

    // return res.json({
    //   user: { id, name, email },
    //   admin: { admin },
    //   token: jwt.sign({ id }, authConfig.secret, {
    //     expiresIn: authConfig.expiresIn,
    //   }),
    // });
  }
}

export default new SessionController();
