const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require("body-parser")
const cors = require('cors')

const { keywords, operator_name_alpha, operator_name_opr, in_built_methods } = require("./lexical_data")
const operators_alpha = Object.keys(operator_name_alpha)
const operators_opr = Object.keys(operator_name_opr)

app.use(bodyParser.json());
app.use(cors());

router.post('/lexical-analysis', (req, res) => {
    var token_table = []
    code_file = req.body["code"].split("\n")
    tmp = ""

    for (var i in code_file) {
        for (var j of keywords) {
            if (code_file[i].trim().search(j) != -1) {
                tmp += code_file[i].replace(j, "")
                token_table.push({
                    line: parseInt(i) + 1,
                    token: "KEYWORD",
                    attribute: j
                })
            }
        }

        for (var opr_alpha of operators_alpha) {
            if (code_file[i].search(" " + opr_alpha) != -1 || code_file[i].search(opr_alpha + " ") != -1 || code_file[i].search(" " + opr_alpha + " ") != -1) {
                tmp += code_file[i].replace(opr_alpha, "")
                token_table.push({
                    line: parseInt(i) + 1,
                    token: operator_name_alpha[opr_alpha],
                    attribute: opr_alpha
                })
            }
        }

        for (var opr of operators_opr) {
            opr_split = code_file[i].split(opr)
            if (opr_split.length > 1) {
                token_table.push({
                    line: parseInt(i) + 1,
                    token: operator_name_opr[opr],
                    attribute: opr
                })
            }
        }
    }

    const tokens = []
    for (var at of token_table) {
        if (!operators_alpha.includes(at["attribute"])) {
            tokens.push(at["attribute"])
        }
    }

    for (var at of token_table) {
        if (operators_alpha.includes(at["attribute"])) {
            tokens.push(at["attribute"])
        }
    }

    identfiers = []
    for (var line in code_file) {
        str = code_file[line]
        for (var toke of tokens) {
            if (str.replace(toke, "")) {
                str = str.replace(toke, "")
            }
        }
        identfiers.push({
            line: parseInt(line) + 1,
            str: str.trim()
        })
    }

    for (var idtn of identfiers) {
        idtn_split = idtn["str"].split(" ")
        if (idtn_split.length > 1) {
            for (var s of idtn_split) {
                if (s) {
                    token_table.push({
                        line: idtn["line"],
                        token: isNaN(s) ? s.search("''") ? "Identifier" : "String" : s.split(".").length > 1 ? "Float" : "Integer",
                        attribute: s
                    })
                }
            }
        }
    }
    res.send(token_table)
})

module.exports = router