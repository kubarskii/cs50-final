import http from 'http';
import { UserController } from './src/controllers/user.controller';
import { RoomController } from './src/controllers/room.controller';
import runWS from './src/ws';
import { REST_API_PORT } from './constants';
import Router from './src/utils/router';

const srv = http.createServer();
const router = new Router(srv, '/rest/api');
router.get('/user', UserController.login);
router.get('/user/rooms', RoomController.getRooms);
router.get('/user/search', UserController.findUserByInput);
router.get('/messages', RoomController.getMessagesInRoom);
router.get('/room/users', RoomController.getUsersInRoom);

router.post('/user', UserController.register);
router.post('/room', RoomController.createRoom);

router.delete('/room', RoomController.deleteRoom);
router.delete('/user', UserController.delete);

runWS({ server: srv });

srv.listen(REST_API_PORT, () => {
  console.log(`REST is running on ${REST_API_PORT}`);
});
