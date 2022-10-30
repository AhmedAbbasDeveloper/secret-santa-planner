import express from 'express';

const router = express.Router();

router.get('/existing', (_req, res) => {
  res.render('existing');
});

router.post('/existing', (req, res) => {
  const { groupID } = req.body;
  res.redirect(`/${groupID}/enter-name`);
});

export default router;
