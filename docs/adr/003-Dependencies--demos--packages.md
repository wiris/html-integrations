# 001. Guides to decide where to place the dependencies in the package.json files

Date: 19-nov-2020

## Status

ACCEPTED  

## Summary

*When dependencies are installed they can be a part of three diferent blocks.*

*The aim of this guide is to Explain when a dependency has to be in a certain block for this project.*

## Context (Discussion)

In the context of the html-integration project we want to define an effective node.js dependency management for the mathtype web plugins,the demos and ageneric definition for both.

There are three types of dependencies with which to work on this project:
* **Dependency**: This property contains the names and versions of the node modules which are required at runtime, e.g: start a demo.
* **DevDependency**: This property contains the names and versions of the node modules which are required only for development purposes
* **PeerDependency**: Dependencies that are exposed to the developer using the module. The module is telling us that it is a dependency we should take care about and install it.

## Decision

### **Criteria per demos**

These criteria are detailed for the specific case of the demos in the project. There are more generic criterias used to assign a dependency on its place explained at the end of this block.

**Dependency:**
* The editor package with which the demo is built, e.g: *froala*.
* Editor additional tools that provide different functionalities.
* The wiris mathtype package.

**DevDependency:**
* As the general rule says, CLI, webpack modules and others that are only used once to generate the compiled file needed.

**PeerDependency** 
* In case some package needs to be from a specific versions, for example, we need to run a demo in a specific angular version due to some possible incompatibilities in other versions.

### **Criteria per wiris packages:**

These criteria are detailed for the specific case of the wiris packages in the project. There are more generic criterias used to assign a dependency on its place explained in the next section.

**Dependency:**
* The packages that are imported in the source file. (e.g: ckeditor5 package that impots @ckeditor5 enginge in one of its source files)

**DevDependency:**
* The wiris mathtype package, because it needs to be installed in the demo, this way we avoid duplicates.
* The rest of the packages that which do not acomplish the dependency rule.

**PeerDependency** 
* None for now.

### **Generic default criterias that can be applyed to the demos and packages:**

It all *depends*, but here are some tips to help in the decision.

**Dependency:**
* If a module is imported on the node application code (e.g: require or import statements). Anything else goes as devDependency.

**DevDependency:**
* Dependencies is not needed to run a demo with `npm start`.
* Packages like *ESLint*, unless excepcional cases.
* Testing frameworks: *Mocha*, *Jest*, etc.
* Code-coverage tools, such as *coveralls* and *nyc*.
* Servers used for local development, like *serve*, *htttp-server*, etc.
* Documentation tools such as *JSDoc*.

**PeerDependency** 
* Just the cases where it's mandatory to use a specific version to have the expected behavior.

### Pros and Cons of the Options 

We have a consistent way to decide whta is a dependency and what is not (*pro*), but all of this depends on the project and other axternal factors, so it's more complicated thant that, it's subjective (*con*)

## Consequences (Results)

The consequence is to have a consistent default way to treat dependencies so the project is better structured and does not waste time because of the wrong treatment of the npm package dependencies.
 