const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(cors());
app.use(express.json());
morgan.token('type', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :type')
);

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

// App Info
app.get('/info', (req, res) => {
  res.send(
    `<p> Phonebook has enough info for ${persons.length} people </p><p>${Date(
      Date.now()
    ).toString()}</p>`
  );
});

//GET ALL - Returns Entire API
app.get('/api/persons', (req, res) => {
  res.json(persons);
});

//GET ONE
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

//DELETE Request
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//UPDATE request - POST
app.post('/api/persons', (req, res) => {
  const body = req.body;
  //console.log(req.body.content);

  const duplicate = persons.find((person) => person.name === body.name);
  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'need name and number' });
  } else if (duplicate) {
    return res.status(400).json({ error: 'name must be unique' });
  }
  console.log('object:', body, '\n Request headers:', req.headers);
  // Using some arbitrary high value for max random id
  body.id = getRandomInt(1000000);
  persons = persons.concat(body);
  res.json(body);
});

const PORT = process.env || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
