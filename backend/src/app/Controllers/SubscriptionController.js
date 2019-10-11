import { isBefore, parseISO } from 'date-fns';
import { parse } from 'ipaddr.js';
import Subscription from '../models/Subscription';
import Meetup from '../models/Meetup';

class SubscriptionController {
  async store(req, res) {
    const { id: idMeetup } = req.params;

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

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: idMeetup,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
