import { isBefore, parseISO } from 'date-fns';
import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';

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
      return res.status(400).json({ erro: 'user already registered' });
    }

    const meetup = await Meetup.findByPk(idMeetup);
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
        .status(400)
        .json({ erro: 'User registered in another meetup on the same date' });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: idMeetup,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
