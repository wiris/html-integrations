# Changelog

## MathType Web Integrations

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Last release of this project was 2nd of September 2024.

### 8.11.0 2024-09-02

- fix: Superscript getting casted to subscript. #KB-50069
- fix(ck5): Wrong caret position when multiple editor instances. #KB-48969
- chore(ck5): Update dependencies fro v43 compatibility. KB-49655

### 8.10.0 2024-06-26

- fix(ck5): Remove unnecessary calls to our image services. #KB-48217
- feat(ck5): Update installation methods. #KB-47997
- fix: add strict to ts-config. #KB-47912

### 8.9.2 2024-05-22

- feat(viewer):Not halt execution when one of math input is not correct. #KB-43208
- feat(ck5):Allow accepting option field on call editor.setData() function. #KB-43896
- fix: change htmlEntitiesToXmlEntities' implementation in order to assure only valid XML. #KB-45734
- fix: Exclude certain unnecessary files that are copied over during the deployment of TinyMCE 5 & 6 demos to prevent an infinite loop. #KB-44423
- feat(demos): Destroy MathType when the editor is destroyed. #KB-44922
- feat: update telemeter tracking to utilize promises. #KB-45700

### 8.9.1 2024-04-29

- fix(viewer): Render the formula that is not been cached. #KB-44942
- fix(froala): Editor bug with Wiris formulas paste behavior. #KB-46612
- fix(ck5): Editor is called before mathtype. #KB-46221
- fix: Updated dependencies, set minimum node version to 18 and raised ck5 version cap to 27.0.0 #KB-45473

### 8.9.0 2024-04-17

- fix(ck5): Add some DOMPurify exception in order to avoid error when inserting some formula. #KB-44372
- fix: Avoid TypeError when the selected node don't have some properties. #KB-44268
- fix(ck4): Place formula in the correct position after inserting italics (or bold or underlined) text in a new line. #KB-43453
- feat: Upgrade DOMPurify library to avoid deletion of some MathML tags by error. #KB-44328
- feat: Add new 'Commit hash' field to html-viewer demo. #KB-44411
- docs: Add known issues section. #KB-46073

### 8.8.3 2024-03-18

- feat: Create CKEditor5 Vue demo. #KB-36629
- fix(viewer): Update demo to apply changes. #KB-40530
- fix: Set forceHandMode to be an integrationParameter. #KB-42181
- fix(froala): Inline toolbar not allowing to add more thant 1 formula. #KB-42503
- fix(viewer): Allow formulas wothout accessible text to render. #KB-42660
- feat: Add version text on html-viewer window property. #KB-43186
- fix: Update DOMPurify. #KB-43669
- fix(viewer): Take into account language when using cache. #KB-43670
- fix(ck5): Make integration understand language object. #KB-43679
- feat(ck4): Add license key. #KB-43835
- fix: Error when double-click a plain text and open MT/CT editor. #KB-44249
- fix: Error when open a plain text with MT/CT editor. #KB-44250

### 8.8.2 2024-02-05

- fix: Avoid re-decoding formulas when rendering. #KB-43787
- feat: Move handmode config to integrationModal

### 8.8.1 2024-01-29

- fix: MathType breaking editour source plugin. #KB-42401
- fix: Keep base64 images in base64 after fixing their size
- fix: Forced hand not working on keboard formulas
- feat: Make the editor init in hand mode when it's forced by options.
- docs: Fix some minor markdown issues.
- fix(viewer): Formulas with '&' symbol not rendereting
- fix(viewer): hash all parameters before sending get showimage request
- fix: MT breaking CK5 editor source plugin

### 8.8.0 2023-12-20

- fix: Froala + Generic not setting GUI parameters.
- feat: Add method that allows the integration forcing the hand mode.
- feat(viewer): decode safe mathml

### 8.7.3 2023-11-22

- fix(tinymce): non blur chemtype svg icon
- fix: viewer detect if services exist

### 8.7.1 2023-10-30

- fix(ck5): getData returning null when using formulas with '<' and '>'. #KB-40736

### 8.7.0 2023-10-26

- fix(ck5): setData understanding math LaTeX. #KB-39004
- fix: DomPurify replacing undesired characters. KB-39549
- feat: Exposed the telemetry methods in the generic integration. #KB-39815
  - fix: Font and some font properties of the text changed after a formula inserted through the web editor. #KB-39019
  - fix: Re-do action not working in TinyMCE 6 and Froala. #KB-39819
  - fix: Error displayed when adding to the website the contents edited with an HTML editor if some text was added before some LaTeX code.
  - fix: Drag & drop an inserted formula with brackets would change the brackets to parentheses. #KB-39549
- fix: Froala + Generic not setting GUI parameters. #KB-40561

### 8.6.0 2023-10-10

- Feat: Add branch name and commit hash to demo page
- Docs: Improve the Docs article of the integrations installation
- Chore: Rescope @nrwl to @nx
- Feat: Add browsing pages to staging
- Chore: Update MathType external integrations
- Fix: Vulnerability in getmathml service
- Fix: Blackboard + Anthology issues with our last Editor version
- Fix: Demos not taking local devkit
- Fix: CKEditor 5 Hand formulas MathML not being filtered
- Fix: CKEditor 5 LaTeX formulas cannot be edited
- Chore: Update telemeter for html-integrations

### 8.5.0 2023-08-03

- Fix: Prevent initialize multiple telemetes. #KB-35935
- Fix (froala): Console error when uploading an image with the MathType plugin enabled. #KB-36131
- Fix (devkit): Strange behavior when the caret is placed at the beginning of the HTML Editor. #KB-21754
- Fix: The default formulas were opened with CT Modal. #KB-36421
- Feat: Add WordPress integration. #KB-36573

### 8.4.0 2023-06-15

- Fix: add keydown event on window to prevent end of propagation. #KB-21649
- Fix: Close MT Handwriting mode pressing ESC. #KB-21649
- Fix: Handwritten CT formulas open in handwriting mode when double-click. #KB-34309
- Fix: Custom toolbar conflict with less than character. #KB-36262
- Fix: Webpack dependency issues. #KB-33828
- Feat: New Viewer

### 8.3.1 2023-05-23

- Fix (ckeditor5): Hand copied&pasted formulas not opening in hand mode. #KB-32892
- Fix (ckeditor5): Fix memory leak with ClassicEditor. #KB-34718
- Fix (ckeditor5): Copypasted/Dragdropped formula from a window to another is not editable. #KB-24226
- Fix (ckeditor5): Custom Toolbar conflict with ShowImage service when using < and > buttons. #KB-34675
- Fix (ckeditor5): Deletion of the "linebreak" when copy/pasting an equation. #KB-34777

### 8.3.0 2023-05-02

- Fix: detect if device is mobile. #KB-33529
- Fix: don't add an extra whitespace between `<math` and `xmlns`. #KB-32826
- Feat: Add close/open global events. #KB-32324
- Feat: Show a friendly message when going offline. KB-12739
- Feat: Add custom headers to API requests. #KB-34463
- Feat: Changes in the Staging demos for testing automation. #KB-32689
- Fix: Insert button on LaTeX for CKEditor5. #KB-25868
- Fix: Fix editor to work on small width. #KB-33529
- Fix: Make Advanced options usable. #KB-32247

### 8.2.6 2023-03-17

- Fix: "Cancel"+"Cancel" AND "Cancel"+"Close" does not focus the HTML Editor. #KB-24317
- Fix: TinyMCE Dialog cancellation "Cancel" button focuses the HTML Editor instead of the MT/CT Editor. #KB-24314
- Fix: Confirmation dialog closure does not place the caret next to the formula. #KB-26844
- Fix (froala): Remove Unlicensed message. #KB-25900
- Refactor (generic): Remove editor language conf from generic demo. #KB-32550
- Fix (ckeditor4): Copypasted/Dragdropped formula from a window to another is not editable. #KB-24226

### 8.1.1 2023-01-11

- Fix: Generic demos on staging are now in english. #KB-31349
- Fix: tinymce folder names confuse nx. #KB-31663
- Fix: exclude semantics and annotation tags from dompurify. #KB-31876

### 8.0.1 2022-12-14

- Create staging environment
- Vite compatibility
- Webpack 5 with hot reload
- Fix drag and drop issue with ckeditor5 and chemtype

### 8.0.0 2022-09-22

- fix: change webpack demo host to localhost
- feat: Refactor demos for the mono-reposiroty with `yarn` and `nx`. (#KB-25399)
- feat: Remove Tinymce4 from the project to deprecate it.

## 7.31.1 2022-08-18

- docs: add deprecation warning message on froala and tinymce4 package

## 7.30.0 2022-07-20

- fix: add dompurify dependenci and sanitize mathml to prevent XSS
- fix: stop setting data parameter on text nodes
- feat: create plugin for TinyMCE 6

## 7.29.0 2022-06-20

- fix: caret after the formula on first insertion
- fix: chemEnabled & editorEnabled config
- fix: open MT/CT Editor in Keyboard mode when using iOS
- fix: Update links with UTMs

## 7.28.1 2022-05-09

- Fix the redo & undo buttons not working on TinyMCE when interacting with MathType formulas. (KB-14441)
- Create TinyMCE V6 demos for:
  - HTML5
  - Angular
  - React
- Add a dummy TinyMCE6 package.
- Update related documentation and files to include the new TinyMCE V6 demos and package.
- Fix MT/CT Editor mobile responsiveness
- Fix focus when cancel insertion mt editor

## 7.28.0 2022-03-24

- doc: add limitation disclaimer about inline limitations on ChemType and Safari #486.
- Solved error when inserting a modified formula and the cancel button was pressed (#445).
- Remove `jest` completely from the project.
- Fix the `demo-html5-generic` dependencies.
- Update third-party libraries to fix vulnerabilites.
- Added missing 'www' on wiris.net documentation links.
- Destroy events from CKEditor5Integration when CK5 is destroyed.
- Added ADR 005. Use HTML sanitizer to avoid XSS attacks.

- Solve Parser not working on Generic Integrations (Issue - #450)

  - Modify the generic package to use properly the parser functions.
  - Modify the demo to initialyze the editor exposing it to the window, so it can have the necessary configurations to use the Parser class.

- Fix wrapping issue when converting Latex to MathML wothout the Wiris render script (KB-16387 - Issue #419)

  Latex formulas have a semantics tag that requires its inside mathml to be inside a `mrow` tag.
  Added this tag on the Latex formula generation.

- Fix Angular + Froala (v3 & v4) treting Wiris formulas as images.

  - Update Webpack to V5 and remove jQuery, on mathtype-froala3 and its demos.

- Accept non standard ports for host.

- doc: Update Generic integration instructions with a missing step (#KB-19571)

  - On `mathtype-generic` and `mathtype-html-integration-devkit` pacakges

- Start sending data to Cypress Dashboard with the published packages (KB-18683)
- Fix toolbar wiris buttons static label issue on CKEditor5 (KB-13890).

## 7.27.2 - 2021-11-26

## CKEditor5 filtering mechanism

- Allowed unsafe "src" attribute on the <img> element to override CKEditor 5 filtering mechanism (by @oleq)

**Affected packages:**

- @wiris/mathtype-ckeditor5

## 7.27.1 - 2021-09-30

### Fix overlapping issue on TinyMCE V5.

This issue has been applied at demo level. So there was no need
to update the TinyMCE integration's source code.

- Improve all TinyMCE V5 demos to avoid overlapping issues.
  - Bump 'demo-html5-tinymce4' to 1.0.3.
  - Bump 'demo-html5-tinymce5' to 1.0.3.
  - Bump 'demo-angular-tinymce5' to 1.0.4.
  - Bump 'demo-react-tinymce5' to 1.0.2.
  - Bump TinyMCE editor to 5.8.2 on all TinyMCE V5 demos.
  - Improve @wiris/mathtype-tinymce5 README information.

See: https://github.com/wiris/html-integrations/issues/134#issuecomment-90544864

### Add support to the new major version of Froala V4:

- Telemetry level
  - Inform the right version of Froala on environment group.
- Demo level
  - Rename **all** Froala3 demos to Froala
  - Adapt the HTML5 + Froala demo to the lastest Froala version (4).
  - Adapt the React + Froala demo to the lastest Froala version (4).
  - Adapt the Angular + Froala demo to the lastest Froala version (4).
  - Bump 'demo-html5-froala' to 1.0.4.
  - Bump 'demo-angular-froala' to 1.0.4.
  - Bump 'demo-react-froala' to 1.0.3.
- Package level
  - Modify the MathType for Froala 3 plugin to support the latest Froala version (4).
- README level

  - Improve MathType Froala packages and demos README.
  - Modify project README in order to take into account the new changes on the Froala plugin and demos.
  - Created ADR draft 004.
  - Modify the docs/demos README in order to take into account the project improvements on Froala4.

- Solved console error when user clicks mathtype button (TypeWeeoe: illegal invocation)

### Update Angular version on angular demos

- Updated angular version to the 12 on CKEditor5, Froala and TinyMCE5 demos.
- Updated angular + Froala demo README.
- Bump 'demo-angular-tinymce5' to 1.0.5.
- Bump 'demo-angular-ckeditor5' to 1.0.4.
- Bump 'demo-angular-froala' to 1.0.5.

### @wiris/mathtype-froala3

- Fixes "Froala 3 on React does not pre-render formulas" KB-11921.
- Update @wiris/mathtype-froala3 code example to fix pre-render issue.
- Update README instructions

## 7.27.0 - 2021-07-22

- Add Cypress to the project.
- Remove Jest from the project.
- Make a minimal Cypress working environment:
  - Create a command and validation API
  - Add common fixtures
  - Implement an initial selection of E2E & smoke tests
  - Integrate with GitHub actions build system
- Fix TinyMCE behaviour with superscript elements.
- Fix "Undo & Redo broken buttons when there is Wiris in TinyMCE toolbar" (KB-13094 - Issue #275).
- Fixed some character entities not behaving correctly in LaTeX mode (e.g. "<").
- Solve the error when trying to access and undefined variable on the image.js file in html.integration-devkit package.
- Fixed formulas being resizable on TinyMCE.
- Make CKEditor5 non editable when in read-only mode
- Fix focus not comming back to all editors when cancel Button is pressed on MathType editor.
- Updated the CKEditor 5 HTML5 demo documentation to use local packages.
