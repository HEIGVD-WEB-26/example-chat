const express = require('express');
const EventEmitter = require('events');

const router = express.Router();

// "EventBus" from NodeJS
const chat = new EventEmitter();

/* user page */
router.get('/:user/', (req, res) => {
  res.render('longpolling', { user: req.params.user });
});

/* save message */
router.post('/:user/messages', (req, res) => {
  const { user } = req.params;
  const content = req.body.message;
  const message = { user, content };
  chat.emit('message', message); // emit a message on the event bus
  res.json(message); // not really needed, we also return the JSON message as a result to the POST
});

/* long polling */
/* Each listening client will register an event listener on the event emitter */
router.get('/:user/messages', (req, res) => {
  // event listener that sends a JSON response on event
  // completes the waiting request on the client side
  const listener = (message) => res.json(message);
  chat.on('message', listener);
  // remove the event listener on connection close
  res.on('close', () => chat.removeListener('message', listener));
});

module.exports = router;
