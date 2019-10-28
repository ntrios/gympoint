import User from '../models/User';

class UserController {
  async store(req, res) {
    // check if exist email in BD
    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { id, name, email, admin } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      admin,
    });
  }

  update(req, res) {
    const
  }
}

export default new UserController();
