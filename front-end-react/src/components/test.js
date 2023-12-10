{
  "code_structure":{
     "socket":{
        "objects":{
           "server":[
              "bind",
              "gethostname",
              "listen",
              "accept",
              "close"
           ]
        },
        "methods":{
           "socket":{
              "type":"in-built",
              "description":"Classes that simplify writing network servers.",
              "parameters":"socket"
           },
           "gethostname":{
              "type":"in-built",
              "description":"Return a string containing the hostname of the machine where the Python interpreter is currently executing. Raises an auditing event socket.gethostname with no arguments. Note: gethostname() doesn’t always return the fully qualified domain name; use getfqdn() for that. Availability: not WASI.",
              "parameters":"gethostname"
           }
        }
     },
     "tqdm":{
        "objects":{
           "progress_bar":[
              "update",
              "n)"
           ]
        },
        "methods":{
           "tqdm":{
              "type":"tqdm-package-method",
              "description":"no-description",
              "parameters":"tqdm"
           }
        }
     },
     "requests":{
        "objects":{},
        "methods":{
           "post":{
              "type":"requests-package-method",
              "description":"no-description",
              "parameters":"post"
           }
        }
     }
  },
  "class_data":{
     "in_built_methods":{
        "int":"Converts a number or string to an integer.",
        "list":"Creates a list.",
        "len":"Returns the number of items in an object.",
        "str":"Converts an object into a string representation."
     },
     "Test":[
        {
           "constructor":"__init__(self, msg):",
           "constructor_parameters":[
              "self",
              " msg"
           ]
        },
        {
           "class_method":"display(self)",
           "class_method_parameters":[
              "self"
           ]
        }
     ],
     "Test2":[
        {
           "constructor":"__init__(self, msg2):",
           "constructor_parameters":[
              "self",
              " msg2"
           ]
        },
        {
           "class_method":"display2(self)",
           "class_method_parameters":[
              "self"
           ]
        }
     ]
  },
  "exception_data":{
     "NameError":"Raised when a local or global name is not found. This applies only to unqualified names. The associated value is an error message that includes the name that could not be found. The name attribute can be set using a keyword-only argument to the constructor. When set, it represents the name of the variable that was attempted to be accessed. Changed in version 3.10: Added the name attribute."
  },
  "public_methods":{
     "server_rec()":[
        ""
     ]
  }
}
