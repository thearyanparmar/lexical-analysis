const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require("path");
const PORT = 3002

app.use(bodyParser.json());
app.use(cors());

const lexical_analyzer_router = require('./lexical_analyzer');
const doc_generator_router = require('./doc_generator');
const firestore_operations = require('./firestore_operations')

app.use(lexical_analyzer_router);
app.use(doc_generator_router)
app.use(firestore_operations)

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});