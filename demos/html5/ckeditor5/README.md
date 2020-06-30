# Demo for mathtype on html5

Here are some instructions to work with this demo and with lerna, as it is complicated to do the same way the other demos do. That is because CKEditor 5 does not let to have duplicate modules, and this has interferences whit the demo in the development mode. 

## Production mode

Use one of the following commands to run the demo in the production mode:
```sh
$ npm start
$ npm deploy
$ npm build-dev
```

## Development mode

To run the demo in the development mode, some changes have to be done:

1. Replace the content of the "@wiris/mathtype-ckeditor5" to **"file:../../../packages/mathtype-ckeditor5/wiris-mathtype-ckeditor5-7.20.0.tgz"** but with the correct version. Now it is 7.20.0 but it can change in the future. Check the current version in the plugin package.json.
2. Run the command `npm build-dev-2` to run the demo with the package in the development mode.