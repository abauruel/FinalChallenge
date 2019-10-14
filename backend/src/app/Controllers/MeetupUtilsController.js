import { Op } from 'sequelize';
import { format } from 'date-fns';
import Meetup from '../models/Meetup';

class MeetupsUtilsController {
  async index(req, res) {
    const dateNow = new Date();
    const meetups = await Meetup.findAll({
      order: [['data']],
      where: {
        data: {
          [Op.gte]: dateNow,
        },
      },
    });
    return res.json(meetups);
  }

  async indexDate(req, res) {
    const { page = 1, date } = req.query;

    const dateEnd = new Date(date);
    dateEnd.setMinutes(`${dateEnd.getMinutes() + 1439}`);

    const meetups = await Meetup.findAll({
      order: [['data']],
      limit: 10,
      offset: (page - 1) * 10,
      where: {
        data: {
          [Op.gte]: new Date(date),
          [Op.lte]: dateEnd,
        },
      },
    });
    return res.json(meetups);
  }
}

export default new MeetupsUtilsController();
