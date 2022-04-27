# Changelog

## MathType Web Integrations

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Last release of this project is was 30th of September 2021.

## UNRELEASED

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