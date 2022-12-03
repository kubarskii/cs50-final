import Router from '@me/http-router';
import http from 'http';
import webPush from 'web-push';
import { NOTIFICATIONS_PORT, PRIVATE_KEY, PUBLIC_KEY } from './constants';
import { NotificationsController } from './src/controllers/notifications.controller';

webPush.setVapidDetails(
  'mailto:sasha.kub95@gmail.com',
  PUBLIC_KEY,
  PRIVATE_KEY,
);

const srv = http.createServer();
const router = new Router(srv);

router.post('/subscribe', NotificationsController.subscribe);
router.post('/notify', NotificationsController.notify);
router.post('/notifyAll', NotificationsController.notifyAll);
router.post('/unsubscribe', NotificationsController.unsubscribe);

srv.listen(NOTIFICATIONS_PORT, () => {
  console.log(`REST is running on ${NOTIFICATIONS_PORT}`);
});
