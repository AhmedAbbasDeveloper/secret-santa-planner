import express from 'express';

import Group from '../models/group.js';
import Participant from '../models/participant.js';

const router = express.Router();

router.get('/:groupID/:participantName', async (req, res) => {
  const { groupID, participantName } = req.params;

  const group = await Group.findById(groupID);
  const gifter = await Participant.findOne({
    secretSantagroup: group._id,
    name: participantName,
  });
  const giftee = await Participant.findOne({
    secretSantagroup: group._id,
    gifter: participantName,
  });

  if (!group || !gifter || !giftee) {
    console.log("Couldn't find one or more participant.");
    res.redirect(`/${groupID}/${participantName}`);
    return;
  }

  if (gifter.choices.length === 0) {
    res.render('send-choices', { budget: group.budget });
    return;
  }

  res.render('final', {
    name: gifter.name,
    budget: group.budget,
    giftee: giftee.name,
    choices: giftee.choices,
  });
});

router.post('/:groupID/:participantName', async (req, res) => {
  const { groupID, participantName } = req.params;
  const { choice1, choice2, choice3 } = req.body;

  await Participant.updateOne(
    { secretSantagroup: groupID, name: participantName },
    { $push: { choices: [choice1, choice2, choice3] } },
  );

  res.redirect(`/${groupID}/${participantName}`);
});

export default router;
