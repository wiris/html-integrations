# Resources folder
Resource folder containing files and functions common among more than one demo. It may also contain other files that are commonly used in different places in the project

## File manifest

```bash
resources
├── demos
│   ├── common_file-1
│   ├── common_file-2
|   ├── ...
|   └── common_file-m
├── img
│   ├── img-1
│   ├── img-2
|   ├── ...
|   └── img-m
├── ...
├── package.json
└── README.md
```

* The folder srtucture accepts new folders with other files that can be used anywhere in the project.
* The package.json file is necessary to dotate the folder the capacity of being a package and being imported in any file.
* The files named *common_file-m* are the ones used in the demos project. They are script, css and html files.