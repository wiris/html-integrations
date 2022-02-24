# 005. Use DOMPurify as HTML sanitizer to avoid XSS attacks

Date: 29-no-2021

## Status

PROPOSED

## Summary

_An XSS vulnerability has been detected on the MathType devkit package._
_A user could inject malicious code using the editor by encapsulating them inside a `<math>` tag._
_In order to prevent XSS attacks, we will use the DOMPurify third-party library. An open-source XSS sanitizer for HTML, MathML and SVG code._

## Context

All browser engines, during _parsing_ step, they turn the data received over the network into the DOM. Given the following block, which uses the `<math>` tag:

```html
<math>
  <style>
    <img src onerror="alert(1)" />
  </style
</math>
```

The browser engine will generate it to:

```html
<MathML math>
  <MathML style> <MathML img src onerror="alert(1)" /></MathML
></MathML>
```

Normally, an `<img>` inside an `<style>` will be parsed as a `#text` inside the `<MathML style>` tag. Nevertheless, this behavior changes when it's encapsulated inside a `<math>` tag, and interprets the `img` as a `<MathML>` independent block. 

As a result, the HTML will be unwrapped and written on the DOM following this format:

```html
<math>
  <img src onerror="alert(1)" />
  <style></style>
</math>
```

This parsing behavior can be used to inject malicious JavaScript on a website. In order to avoid this vulnerability, is needed to filter all the HTML added from the editor.

Implementing a sanitize system can be laborious, and it will be difficult to maintenance in order to detect as much XSS vulnerabilities as possible.

## Decision

DOMPurify sanitize HTML and prevents XSS attacks. You can feed DOMPurify with strings full of dirty HTML, and it will return a string without ant dangerous HTML.

DOMPurify will be added to `@wiris/mathtype-html-integration-devkit` and, therefore, this dependency will affect to all the packages and demos on this project.

### Pros and Cons of the Options

#### Implement our own JavaScript library for that

- Bad, because it is a huge task to detect all possible XSS injections.
- Bad, because we'll need to maintain it.
- Good, we will have full control on the library.

#### Using a third party library like github.com/cure53/DOMPurify

- Good, because it's well maintained, no issues and widely used; (1,612,881 downloads/week).
- Good, because it solves our problem immediately.
- Good, because it's secure, small and cross-platform.
- Bad, because we're adding a new dependency to our core library, and therefore, to all the packages on the project.

## Consequences

Adding a dependency to our main library means that all the packages on this project will include it, too.

No specific changes need to be done to our current GitHub's Dependabot strategy as a result of this decision.

## Links

- [Populating the page: how browsers work](https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work)
- [The process of browser parsing and rendering HTML documents](https://developpaper.com/the-process-of-browser-parsing-and-rendering-html-documents/)
- [npm DOMPurify](https://www.npmjs.com/package/dompurify)
- [GitHub DOMPurify](https://github.com/cure53/DOMPurify)
