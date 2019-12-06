import Sequelize, { Model } from 'sequelize';

class Plan extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
<<<<<<< HEAD
        price: Sequelize.INTEGER,
        canceled_at: Sequelize.DATE,
=======
        price: Sequelize.FLOAT,
        cancelled_at: Sequelize.DATE,
>>>>>>> feature/enrollment
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Plan;
