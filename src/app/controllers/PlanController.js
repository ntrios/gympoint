import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      where: { canceled_at: null },
      order: ['duration'],
      attributes: ['title', 'duration', 'price'],
    });

    return res.json(plans);
  }
}

export default new PlanController();
