import 'dotenv/config';
import bodyParser from 'body-parser';
import express from 'express';
import {
  connect, model, Schema,
} from 'mongoose';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

connect(process.env.DB_URL);

const groupSchema = new Schema({
  name: String,
  budget: Number,
});
const Group = model('Group', groupSchema);

const participantSchema = new Schema({
  name: String,
  giftee: String,
  gifter: String,
  choices: [String],
  secretSantagroup: Schema.Types.ObjectID,
});
const Participant = model('Participant', participantSchema);

app.get('/', (_req, res) => {
  res.render('index');
});

app.get('/new', (req, res) => {
  const { tooFew } = req.query;
  res.render('new', { tooFew });
});

app.post('/new', (req, res) => {
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

app.get('/:groupID/confirmation', (req, res) => {
  const { groupID } = req.params;
  res.render('confirmation', { groupID, link: `/${groupID}/enter-name` });
});

app.get('/existing', (_req, res) => {
  res.render('existing');
});

app.post('/existing', (req, res) => {
  const { groupID } = req.body;
  res.redirect(`/${groupID}/enter-name`);
});

app.get('/:groupID/enter-name', async (req, res) => {
  const { groupID } = req.params;

  const participants = await Participant.find({ secretSantagroup: groupID });

  if (!participants) {
    console.log("Can't find participants");
    res.redirect(`/${groupID}/enter-name`);
  }

  res.render('enter-name', { participants });
});

app.post('/:groupID/enter-name', (req, res) => {
  const { groupID } = req.params;
  const { participantName } = req.body;
  res.redirect(`/${groupID}/${participantName}`);
});

app.get('/:groupID/:participantName', async (req, res) => {
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

app.post('/:groupID/:participantName', async (req, res) => {
  const { groupID, participantName } = req.params;
  const { choice1, choice2, choice3 } = req.body;

  await Participant.updateOne(
    { secretSantagroup: groupID, name: participantName },
    { $push: { choices: [choice1, choice2, choice3] } },
  );

  res.redirect(`/${groupID}/${participantName}`);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
