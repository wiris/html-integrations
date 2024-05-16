# CKEditor integration in Vue

A simple Vue App integrating WIRIS MathType on a CKEditor 5 and step-by-step information on how to build it. The code of this example loads a rich text editor instance with a default value.

## Requirements

- npm
- Vue (_Currently_ v11.2.10)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## How to run the demo

```sh
$ yarn
$ nx start vue-ckeditor5
```

_More information on the different ways to run a demo [here](../../README.md)_

Runs the app in the development mode.<br />
Open [http://localhost:5173/](http://localhost:5173/) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.

## How to add MathType to CKEditor from scratch

1. Run the following through the terminal to install needed dependencies:

   ```sh
   $ npm init vue@latest
   $ cd $APP_NAME
   $ npm install --save @ckeditor/ckeditor5-vue
   $ npm install --save @ckeditor/vite-plugin-ckeditor5
   $ npm install --save @wiris/mathtype-ckeditor5
   ```

2. Install CKEditor5 ClassicEditor dependencies:

   ```sh
   $ npm install --save @ckeditor5-editor-classic
   $ npm install --save @ckeditor/ckeditor5-essentials
   $ npm install --save @ckeditor/ckeditor5-basic-styles
   $ npm install --save @ckeditor/ckeditor5-link
   $ npm install --save @ckeditor/ckeditor5-paragraph
   $ npm install --save @ckeditor/ckeditor5-theme-lark
   ```

3. Open the _vite.config.ts_ file and add:

   ```ts
   import { fileURLToPath, URL } from "node:url";
   import { defineConfig } from "vite";
   import vue from "@vitejs/plugin-vue";
   import ckeditor5 from "@ckeditor/vite-plugin-ckeditor5";

   export default defineConfig({
     plugins: [vue(), ckeditor5({ theme: require.resolve("@ckeditor/ckeditor5-theme-lark") })],
     resolve: {
       alias: {
         "@": fileURLToPath(new URL("./src", import.meta.url)),
       },
     },
     optimizeDeps: {
       exclude: ["@wiris/mathtype-html-integration-devkit", "resources"],
     },
   });
   ```

4. Open _src/main.ts_ and replace all with:

   ```ts
   import { createApp } from "vue";
   import App from "./App.vue";
   import CKEditor from "@ckeditor/ckeditor5-vue";
   import "./assets/css/main.css";

   createApp(App).use(CKEditor).mount("#editor");
   ```

5. Open _src/App.vue_ and replace all with:

   ```html
   <template>
     <div id="app">
       <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" @ready="onEditorReady"></ckeditor>
     </div>
   </template>

   <script lang="ts">
     import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";

     import { Essentials } from "@ckeditor/ckeditor5-essentials";
     import { Bold, Italic } from "@ckeditor/ckeditor5-basic-styles";
     import { Link } from "@ckeditor/ckeditor5-link";
     import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
     // @ts-ignore
     import MathType from "@wiris/mathtype-ckeditor5/src/plugin";

     // Get the initial content.
     const content = "";

     const toolbar = ["bold", "italic", "link", "undo", "redo", "MathType", "ChemType"];
     const plugins = [Essentials, Bold, Italic, Link, Paragraph, MathType];
     const editorConfig = {
       iframe: true,
       charCounterCount: false,
       plugins,
       toolbar,
       htmlAllowedTags: [".*"],
       htmlAllowedAttrs: [".*"],
       htmlAllowedEmptyTags: ["mprescripts"],
       imageResize: false,
       useClasses: false,
     };

     export default {
       name: "#app",
       data() {
         return {
           editor: ClassicEditor,
           editorData: content,
           editorConfig,
         };
       },
     };
   </script>
   ```

6. Finally, you are ready to start the demo with the commands:

   ```
     npm install
     npm run dev
   ```
