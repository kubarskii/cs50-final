import { DEFAULT_HEADERS } from '@me/router/constants';
import webPush from 'web-push';
import db from '@me/server/src/utils/db';
import authHeaderParser from '@me/server/src/utils/auth-header-parser';
import Notification from '../models/notification';

const notification = new Notification(db);

export const NotificationsController = {
  async subscribe(req, res) {
    const token = req.headers.authorization;
    const { payload: { id: userId } } = authHeaderParser(token);
    if (!userId) {
      res.error(400, 'Invalid Authorization header', DEFAULT_HEADERS);
    }
    const { endpoint, expirationTime, keys: { p256dh, auth } } = await req.body();

    const exists = await notification.isSubscriptionExists(userId, endpoint);

    if (exists) {
      res.json(200, { status: 'exists' }, DEFAULT_HEADERS);
      return;
    }
    await notification.create({
      user_id: userId, endpoint, expiration_time: expirationTime, p256dh, auth,
    });
    res.json(200, { status: 'success' }, DEFAULT_HEADERS);
  },

  async notify(req, res) {
    const body = await req.body();
    const { userId, payload = { title: 'New message' } } = body;
    if (!userId) {
      res.error(400);
      return;
    }

    const subscriptions = await notification.getCredentialsByUserId(userId);

    subscriptions.forEach((subscription) => {
      webPush.sendNotification(subscription, JSON.stringify(payload))
        .catch((error) => {
          console.error(error.stack);
        });
    });

    res.json(200, { status: 'success' }, DEFAULT_HEADERS);
  },

  async notifyAll(req, res) {
  },

  async unsubscribe(req, res) {
  },
};
