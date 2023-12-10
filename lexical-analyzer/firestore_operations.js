const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require("body-parser")
const cors = require('cors')
const fs = require("firebase-admin")

app.use(bodyParser.json());
app.use(cors());

const serviceAccount = require('./secretKey.json')

fs.initializeApp({
    credential: fs.credential.cert(serviceAccount)
});

const db = fs.firestore();
const documentation_ref = db.collection("Documentation")

router.post('/store', async (req, res) => {
    code_structure = req.body.code_structure
    const response = await documentation_ref.add(code_structure)
    res.send(response)
})

router.post("/document", async (req, res) =>{
    doc_id = req.body.doc_id
    doc_ref = documentation_ref.doc(doc_id)
    document_data = await doc_ref.get()
    res.send(document_data.data())
})

module.exports = router