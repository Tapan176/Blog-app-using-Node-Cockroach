const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('../user/userRoutes');
const authRoutes = require('../auth/auth.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use(userRoutes);
app.use(authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}!`);
});