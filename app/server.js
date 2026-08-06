const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


const userRoutes = require('./src/routes/user');

// register the user route
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to my Express server!');
});


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});