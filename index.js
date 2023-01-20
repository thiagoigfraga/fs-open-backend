const express = require("express");
const morgan = require("morgan");
const app = express();

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const generateNewId = () => {
  return Math.floor(Math.random() * 100000);
};

morgan.token('body', (req, res) => JSON.stringify(req.body));


app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((c) => c.id === id);

  if (!person) {
    return response.status(400).end();
  }

  response.json(person);
});

app.get("/api/info", (request, response) => {
  response.send(`
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${new Date()}</p>
  `);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  persons = persons.filter((c) => c.id !== id);

  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(404).json({
      error: "User needs a name",
    });
  }

  if (!body.number) {
    return response.status(404).json({
      error: "User needs a number",
    });
  }

  const alreadyInPhonebook = persons.find((p) => p.name === body.name);

  if (alreadyInPhonebook) {
    return response.status(404).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateNewId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`App running in port:${PORT}`);
});
