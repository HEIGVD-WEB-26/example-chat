/* eslint-disable  */
const express = require('express');

const router = express.Router();

// A map of inboxes (`user -> [{user, content}]`). For each user store the last non read messages that were posted by all users.
const inboxes = new Map();

/* user page */
router.get('/:user/', (req, res) => {
  res.render('polling', { user: req.params.user });
});

/* save message */
router.post('/:user/messages', (req, res) => {
  const { user } = req.params;
  const content = req.body.message;
  const message = { user, content }; // create a "Tuple" {user: "userX", content: "Contents"}
  if (!inboxes.has(user)) {
    inboxes.set(user, []);
  }

  // push the message in the inbox of all users of the map
  for (let inbox of inboxes.values()) { // iterate over the map's values = inbox = array of messages for each user
    inbox.push(message);
  }
  res.json(message);
});

/* poll messages : sends back the last "non-read" messages */
router.get('/:user/messages', function (req, res) {
  let user = req.params.user;
  if (!inboxes.has(user)) {
    inboxes.set(user, []);
  }
  let messages = inboxes.get(user); // get messages for the current user
  inboxes.set(user, []); // empty the mailbox of the user (we append the new ones in the HTML), so save on data and avoid having to send very long messages

  res.json(messages.reverse()); // reverse the order of messages so that the oldest one appears on top
});

module.exports = router;