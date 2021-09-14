# Changelog

## MathType Web Integrations

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Last release of this project is was 22nd of July 2021.

## [Unreleased]

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

## [Unreleased]

- Fix overlapping issue on TinyMCE V5.

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

- Add support to the new major version of Froala, the number 4:

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

- Update Angular version on angular demos
  - Updated angular version to the 12 on CKEditor5, Froala and TinyMCE5 demos.
  - Updated angular + Froala demo README.
  - Bump 'demo-angular-tinymce5' to 1.0.5.
  - Bump 'demo-angular-ckeditor5' to 1.0.4.
  - Bump 'demo-angular-froala' to 1.0.5.
  
- Fix toolbar wiris buttons static label issue on CKEditor5.

  This issue was because the label on the Wiris toolbar buttons was static, so when the editor had a different language defined than english, the buttons were still in english

  - Add a dynamic treatment on the label buttons string on:
    - CKEditor5.
    - CKEditor4.
    - Froala 3 & 4.

  Since CKEditor5 has a very unique and different integration than the other ones, this will be the only one where the language currently changes to the defined on the editor.  
