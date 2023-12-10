const puppeteer = require('puppeteer');
const fs = require("fs");
const express = require('express')
const path = require('path')
const bodyParser = require("body-parser")
const app = express()
const router = express.Router()

const { keywords, operator_name_alpha, operator_name_opr, in_built_methods } = require("./lexical_data");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(require('cors'))

router.post('/doc_generator', async (req, res) => {
    const code = req.body["code"].split("\n")
    const response = await analysis(code)
    console.log(JSON.stringify(response))
    res.send(JSON.parse(response))
})

async function scrapeData(URL) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(URL);

    const data = await page.evaluate(() => {

        const built_in_functions = Array.from(document.querySelectorAll("dl")).map(data => ({
            name: data.querySelector("dt").textContent.trim(),
            description: data.querySelector("dd").textContent.trim()
        }));

        return {
            built_in_functions
        };
    });

    await browser.close();

    return data;
}

async function analysis(code) {
    code_structure = {}
    for (var i of code) {
        if (i.search(",") != -1 && i.search("import") != -1) {
            code_split_tmp = i.split("import")
            code_split = code_split_tmp[code_split_tmp.length - 1].split(",")
        } else {
            code_split = i.split("import")
        }
        if (code_split.length > 1) {
            code_structure[code_split[code_split.length - 1].trim()] = {
                objects: {},
                methods: {}
            }
        }
    }

    for (var i of code) {
        for (var j of Object.keys(code_structure)) {
            obj_split = i.split(j)
            methods_split = i.split(`${j}.`)

            if (obj_split.length > 1 && obj_split[0].search("=") != -1) {
                code_structure[j]["objects"][obj_split[0].slice(0, obj_split[0].indexOf("=") - 1).trim()] = []
            }

            if (methods_split.length > 1) {
                method = methods_split[methods_split.length - 1]
                console.log(method.slice(method.indexOf("(") + 1, method.indexOf(")")).split(",").join(", "))
                method_paramaeter_string = method.slice(method.indexOf("(") + 1, method.indexOf(")")).split(",").join(", ")
                method = method.slice(0, method.indexOf("("))
                code_structure[j]["methods"][method] = {
                    type: `${j}-package-method`,
                    description: "no-description",
                    parameters: method_paramaeter_string
                }
            }

            for (var obj of Object.keys(code_structure[j]["objects"])) {
                object_split = i.split(`${obj}.`)
                if (object_split.length > 1) {
                    arr = object_split[object_split.length - 1].split(".")
                    new_arr = arr.filter((item) => {
                        code_structure[j]["objects"][obj].push(item.slice(0, item.indexOf("(")))
                    })
                }
            }
        }
    }

    class_data = { in_buil_methods: {} }
    exception_data = {}
    public_methods = {}

    for (var i in code) {
        def_pos = code[i].search("def")
        except_pos = code[i].search("except")

        if (code[i].slice(0, 5) == "class") {

            class_data[code[i].slice(6, code[i].indexOf(":"))] = []
            indent = parseInt(i)

            while (indent < code.length) {
                if (code[indent + 1].slice(0, 4) == "" * 4) {
                    class_line = code[indent + 1]

                    if (class_line.search("__init__") != -1) {
                        constructor_string = class_line.slice(class_line.indexOf("_"),)

                        index_1 = constructor_string.indexOf("(") + 1
                        index_2 = constructor_string.indexOf(")")
 
                        class_data[code[i].slice(6, code[i].indexOf(":"))].push({
                            constructor: constructor_string.slice(0, constructor_string.indexOf("(")) + "()",
                            constructor_parameters: constructor_string.slice(index_1, index_2).split(","),
                            construcor_description: "no - description",
                            id: Math.random().toString(36).substring(2, 12)
                        })
                    }
                    def_pos = class_line.search("def")
                    if (def_pos != -1 && class_line.search("__init__") == -1) {
                        class_method = class_line.slice(def_pos + 4, class_line.indexOf(":"))

                        index_1 = class_method.indexOf("(") + 1
                        index_2 = class_method.indexOf(")")

                        class_method_parameters = class_method.slice(index_1, index_2).split(",")
                        class_method = class_method.slice(0, class_method.indexOf("(")) + "()"
                        class_method_description = "no - description"

                        class_data[code[i].slice(6, code[i].indexOf(":"))].push({
                            class_method,
                            class_method_parameters,
                            class_method_description,
                            id: Math.random().toString(36).substring(2, 12)
                        })
                    }
                } else { break }

                indent += 1
            }
        }

        for (var method of Object.keys(in_built_methods)) {
            if (code[i].search(method) != -1) {
                class_data["in_buil_methods"][method] = in_built_methods[method]
            }
        }

        if (def_pos == 0) {
            def_split = code[i].split("def")
            index_l = code[i].indexOf("(")
            index_r = code[i].indexOf(")")
            def_name = def_split[def_split.length - 1].replace(":", "").trim()
            parameter_string = code[i].slice(index_l + 1, index_r)
            def_parameters = parameter_string.split(",")
            public_methods[def_name] = {
                def_parameters,
                description: "no - description"
            }
        }

        if (except_pos != -1) {
            except_split = code[i].split(" ")
            if (code[i].search("as") != -1) {
                exception_name = except_split[except_split.length - 3]
            } else {
                exception_name = except_split[except_split.length - 1].replace(":", "")
            }
            var data = await scrapeData('https://docs.python.org/3/library/exceptions.html')
            for (var root in data) {
                for (var exceptions of data[root]) {
                    name_split = exceptions["name"].split(" ")
                    if (name_split[name_split.length - 1].replace("¶", "") == exception_name) {
                        exception_data[exception_name] = exceptions["description"]
                    }
                }
            }
        }
    }

    scrap_data = []
    thread_count = Object.keys(code_structure).length

    if (thread_count > 0) {
        for (var i of Object.keys(code_structure)) {
            var data = await scrapeData(`https://docs.python.org/3.11/library/${i}`)
            scrap_data.push(data['built_in_functions'])
            scraped(Object.keys(code_structure).length)
        }
    }
    function scraped() {
        for (var package_key of Object.keys(code_structure)) {
            var package = code_structure[package_key];
            for (var lex of Object.keys(package["methods"])) {
                var flag = 0;
                for (var scrap_key of Object.keys(scrap_data)) {
                    var scrap = scrap_data[scrap_key];
                    for (var scrap_itr of scrap) {
                        if (scrap_itr["name"].includes(lex.slice(0, lex.indexOf("(")))) {
                            flag = 1;
                            package["methods"][lex]["type"] = "in-built";
                            package["methods"][lex]["description"] = scrap_itr["description"];
                            break;
                        }
                    }
                    if (flag === 1) {
                        break;
                    }
                }
            }
        }
        thread_count--;

        if (thread_count === 0) {
        }
    }

    return JSON.stringify({
        code_structure,
        class_data,
        exception_data,
        public_methods
    })
}

module.exports = router