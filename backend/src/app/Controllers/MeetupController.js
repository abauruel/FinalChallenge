import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import Meetup from '../models/Meetup';
import File from '../models/File';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: { user_id: req.userId },
      include: [
        {
          model: User,
          attributes: ['name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['url', 'path'],
            },
          ],
        },
        {
          model: File,
          attributes: ['url', 'path'],
        },
      ],
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const { originalname: name, filename: path } = req.file;
    const schema = Yup.object().shape({
      titulo: Yup.string().required(),
      descricao: Yup.string().required(),
      localizacao: Yup.string().required(),
      data: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation failed' });
    }
    const datehour = parseISO(req.body.data);

    if (isBefore(datehour, new Date())) {
      return res
        .status(401)
        .json({ error: 'is not permitted dates and times old' });
    }

    const file = await File.create({
      name,
      path,
    });

    const meetup = await Meetup.create({
      ...req.body,
      data: datehour,
      user_id: req.userId,
      imagem: file.id,
    });
    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      titulo: Yup.string(),
      descricao: Yup.string(),
      localizacao: Yup.string(),
      data: Yup.date(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation invalid' });
    }

    const { id: idMeetup } = req.params;
    const sponsor = req.userId;
    const meetup = await Meetup.findOne({
      where: { id: idMeetup, user_id: sponsor },
    });
    if (!meetup) {
      return res
        .status(401)
        .json({ error: 'Only sponsor can change or modify' });
    }
    if (isBefore(meetup.data, new Date())) {
      return res.status(401).json({
        error: 'Is not possible change because the event date is passed',
      });
    }

    if (req.body.data) {
      const datehour = parseISO(req.body.data);
      if (isBefore(datehour, new Date())) {
        return res
          .status(401)
          .json({ error: 'is not permitted dates and times old' });
      }
    }

    if (req.file) {
      const { originalname: name, filename: path } = req.file;
      const imagem = await File.findByPk(meetup.imagem);
      imagem.update(name, path);

      meetup.update(req.body);
      return res.json(meetup);
    }

    meetup.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {}
}

export default new MeetupController();
