import { Router } from 'express';

import UserController from './app/Controllers/UserController';
import SessionController from './app/Controllers/SessionController';
import AuthMiddleware from './app/Middlewares/Auth';

const routes = new Router();

routes.post('/user', UserController.store);
routes.post('/session', SessionController.store);
routes.use(AuthMiddleware);
routes.put('/user', UserController.update);

export default routes;
