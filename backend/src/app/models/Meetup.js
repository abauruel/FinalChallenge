import Sequelize, { Model } from 'sequelize';

class Meetup extends Model {
  static init(sequelize) {
    super.init(
      {
        titulo: Sequelize.STRING,
        descricao: Sequelize.STRING,
        localizacao: Sequelize.STRING,
        data: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'imagem' });
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.hasMany(models.Subscription, {
      foreignKey: 'meetup_id',
    });
  }
}

export default Meetup;
