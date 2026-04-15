const EventEmitter = require('events');
const express = require('express');
const expressWs = require('express-ws');

const router = express.Router();
expressWs(router);

const chat = new EventEmitter();

/* user page */
router.get('/:user/', (req, res) => {
  res.render('websocket', { user: req.params.user });
});

/* websocket */
// Clients register an event listener on the event bus to forward messages
// sent to it on their websocket

// When a client sends a message, it is published on the event bus, and sent to all registered WS
router.ws('/:user/messages', (ws, req) => {
  const { user } = req.params;

  // Handle messages coming from client
  ws.on('message', (content) => {
    const message = { user, content };
    chat.emit('message', message); // Emit message on Event Bus so that it can be sent to all listening clients
  });

  // Each client will register an event listener on the Event Bus to receive messages
  // from other websockets (clients)
  // We have a reference on the ws variable in the event listener
  const listener = (message) => ws.send(JSON.stringify(message)); // Send message on the ws websocket
  chat.on('message', listener);
  ws.on('close', () => chat.removeListener('message', listener));
});

module.exports = router;
