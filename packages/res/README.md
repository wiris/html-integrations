# Resources folder

Resource folder containing files and functions common among more than one demo. It may also contain other files that are commonly used in different places in the project

The main goal of this package is to mantain the demos inside the mono-repo project independent of each other and the folders in this repository.

## File manifest

```bash
resources
├── demos
│   ├── common_file-1
│   ├── common_file-2
|   ├── ...
|   └── common_file-m
├── webpack
├── ...
├── package.json
└── README.md
```

- The folder srtucture accepts new folders with other files that can be used anywhere in the project.
- The webpack file is necessary specify the loaders needed to import specific type of files.
