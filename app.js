import 'dotenv/config';
import bodyParser from 'body-parser';
import express from 'express';
import { connect } from 'mongoose';

import rootRoute from './routes/root.js';
import newRoute from './routes/new.js';
import confirmationRoute from './routes/confirmation.js';
import existingRoute from './routes/existing.js';
import enterNameRoute from './routes/enter-name.js';
import participantNameRoute from './routes/participant-name.js';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

connect(process.env.DB_URL);

app.use(
  rootRoute,
  newRoute,
  confirmationRoute,
  existingRoute,
  enterNameRoute,
  participantNameRoute,
);

app.listen(3000, () => {
  console.log('Server started on port 3000.');
});
