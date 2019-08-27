import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/Controllers/UserController';
import SessionController from './app/Controllers/SessionController';
import AuthMiddleware from './app/Middlewares/Auth';
import FileController from './app/Controllers/FileController';
import MeetupController from './app/Controllers/MeetupController';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/user', UserController.store);
routes.post('/session', SessionController.store);
routes.use(AuthMiddleware);
routes.put('/user', UserController.update);
routes.post('/files', upload.single('file'), FileController.store);
routes.get('/meetups', MeetupController.index);
routes.post('/meetup', upload.single('picture'), MeetupController.store);
routes.put('/meetup/:id', upload.single('picture'), MeetupController.update);

export default routes;
