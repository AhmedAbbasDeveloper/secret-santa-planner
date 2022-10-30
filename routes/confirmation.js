import express from 'express';

const router = express.Router();

router.get('/:groupID/confirmation', (req, res) => {
  const { groupID } = req.params;
  res.render('confirmation', { groupID, link: `/${groupID}/enter-name` });
});

export default router;
