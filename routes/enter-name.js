import express from 'express';

import Participant from '../models/participant.js';

const router = express.Router();

router.get('/:groupID/enter-name', async (req, res) => {
  const { groupID } = req.params;

  const participants = await Participant.find({ secretSantagroup: groupID });

  if (!participants) {
    console.log("Can't find participants.");
    res.redirect(`/${groupID}/enter-name`);
  }

  res.render('enter-name', { participants });
});

router.post('/:groupID/enter-name', (req, res) => {
  const { groupID } = req.params;
  const { participantName } = req.body;
  res.redirect(`/${groupID}/${participantName}`);
});

export default router;
