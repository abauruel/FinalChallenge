import { isBefore, parseISO, format } from 'date-fns';

import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Mail from '../../lib/Mail';

class SubscriptionController {
  async store(req, res) {
    const { id: idMeetup } = req.params;

    const checksubscription = await Subscription.findOne({
      where: {
        user_id: req.userId,
        meetup_id: idMeetup,
      },
    });
    if (checksubscription) {
      return res.status(401).json({ erro: 'user already registered' });
    }

    const meetup = await Meetup.findOne({
      where: {
        id: idMeetup,
      },
      include: [{ model: User, attributes: ['email'] }],
    });
    if (!meetup) {
      return res.status(401).json({ error: 'Meetup is not exist' });
    }

    if (meetup.user_id === req.userId) {
      return res
        .status(401)
        .json({ error: 'Unable to subscribe, user is organizer' });
    }

    const dateMeetup = parseISO(meetup.data);
    if (isBefore(dateMeetup, new Date())) {
      return res
        .status(401)
        .json({ error: 'is not permitted dates and times old' });
    }

    const checkMeetupSameDate = await Meetup.findOne({
      where: {
        data: meetup.data,
      },
      include: [
        {
          model: Subscription,
          attributes: [['user_id', 'userid']],
          where: {
            user_id: req.userId,
          },
        },
      ],
    });

    if (checkMeetupSameDate) {
      return res
        .status(401)
        .json({ erro: 'User registered in another meetup on the same date' });
    }

    // const subscription = await Subscription.create({
    //   user_id: req.userId,
    //   meetup_id: idMeetup,
    // });

    const user = await User.findByPk(req.userId);

    await Mail.sendMail({
      to: meetup.User.email,
      subject: 'Novo Inscrito',
      template: 'ConfirmationSubscription',
      context: {
        provider: user.name,
        meetup: meetup.titulo,
        date: format(meetup.data, "'dia' dd 'de' MMMM', as' H:mm'h'"),
        user,
      },
    });

    return res.json(meetup);
  }
}

export default new SubscriptionController();
