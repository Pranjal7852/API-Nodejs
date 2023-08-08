const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
const db = require('./prisma/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Nimbus API Documentation',
      version: '1.0.0',
      description: 'API Documentation for Nimbus',
      contact: {
        name: 'Nimbus Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/',
        description: 'your local server',
      },
      {
        url: 'https://api.hillfairnith.com/', //changes accordingly
        description: 'production live',
      },
    ],
  },
  apis: ['docs/**/*.yml', 'routes/*.js'],
};

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);

// MIDDLEWARES
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('common', { stream: accessLogStream }));

// ROUTES
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerJsdoc(swaggerOptions))
);
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/test', require('./routes/test'));
app.use('/api/discord', require('./routes/discord'));
app.use('/api/users', require('./routes/users'));
app.use('/api/events', require('./routes/events'));
app.use('/api/sponsors', require('./routes/sponsors'));
app.use('/api/auth', require('./routes/auth'));
app.use('/', require('./routes/index'));

// SPA
// app.use(express.static('../nimbus/dist'));
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '..', 'nimbus', 'dist', 'index.html'));
// });

// ERROR BOUNDRY
// eslint-disable-next-line
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// LISTEN
app.listen(PORT, () => {
  db.$connect()
    .then((value) => {
      console.log('connected to database : ', value);
    })
    .catch((err) => {
      console.log('Cant connect to db : ', err);
    });
  console.log(`Listening on port ${PORT}`);
});
