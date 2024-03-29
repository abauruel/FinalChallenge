import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/Controllers/UserController';
import SessionController from './app/Controllers/SessionController';
import AuthMiddleware from './app/Middlewares/Auth';
import FileController from './app/Controllers/FileController';
import MeetupController from './app/Controllers/MeetupController';
import MeetupUtilsController from './app/Controllers/MeetupUtilsController';
import SubscriptionController from './app/Controllers/SubscriptionController';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/user', UserController.store);
routes.post('/session', SessionController.store);
routes.use(AuthMiddleware);
routes.put('/user', UserController.update);
routes.post('/files', upload.single('file'), FileController.store);
routes.get('/mymeetups', MeetupController.index);
routes.get('/meetups', MeetupUtilsController.index);
routes.get('/meetup', MeetupUtilsController.indexDate);
routes.post('/meetup', upload.single('picture'), MeetupController.store);
routes.put('/meetup/:id', upload.single('picture'), MeetupController.update);
routes.delete('/meetup/:id', MeetupController.delete);
routes.post('/meetup/:id/subscription', SubscriptionController.store);
routes.get('/meetup/subscriptions', SubscriptionController.index);

export default routes;
