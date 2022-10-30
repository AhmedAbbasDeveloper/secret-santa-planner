import express from 'express';

import Group from '../models/group.js';
import Participant from '../models/participant.js';

const router = express.Router();

router.get('/new', (req, res) => {
  const { tooFew } = req.query;
  res.render('new', { tooFew });
});

router.post('/new', (req, res) => {
  const participants = Object.entries(req.body)
    .filter((entry) => entry[0] !== 'groupName' && entry[0] !== 'groupBudget')
    .map((entry) => entry[1]);

  if (participants.length < 3) {
    res.redirect('/new?tooFew=true');
    return;
  }

  const { groupName, groupBudget } = req.body;

  const newGroup = new Group({
    name: groupName,
    budget: groupBudget,
  });
  newGroup.save();

  for (let i = participants.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [participants[i], participants[j]] = [participants[j], participants[i]];
  }

  for (let i = 0; i < participants.length; i++) {
    const newParticipant = new Participant({
      name: participants[i],
      giftee: participants[(i + 1) % participants.length],
      gifter: participants[(i - 1 + participants.length) % participants.length],
      secretSantagroup: newGroup._id,
    });
    newParticipant.save();
  }

  res.redirect(`/${newGroup._id}/confirmation`);
});

export default router;
