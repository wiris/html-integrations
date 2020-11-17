# Definition of an effective node.js dependency management for the MathType web plugins

## What is a Dependency?

`npm install` from a directory that contains package.json

This property contains the names and versions of the node modules which are required at runtime, e.g: start a demo. These modules will also be downloaded as dependent package if the application is published as NPM package and used as npm install [package name].

To install a node module as dependency:

```sh
npm install --save [npm package name]
```

This command will add the package name and its version to dependencies section of package.json.
When it installs a package, it also installs any packages that it depends on, but not the devDependencies, as they are not necessary to use the package at runtime.

## What is a devDependency?

`npm install` on a directory that contains package.json, unless you pass the --production flag.

This property contains the names and versions of the node modules which are required only for development purposes, e.g: ESLint, JEST, babel, transpilation, minification, etc.

To install a node module as devDependency there's a long and a short form:

```sh
npm install --save-dev [npm package name]
npm i -D [npm package name]
```

Any of the above command will add the package name and its version to devDependencies section of package.json.

## What is a peerDependency?

Libraries and modules declare in their own package.json their own internal dependencies and peerDependencies.

They are not installed through the `npm install` command, they must be installed manually. 

These peer dependencies are dependencies that are exposed to the developer using the module. The module is telling us that it is a dependency we should take care about and install it. The module may expose an interface where the peer dependency is used, and then we should use a compatible version of the peer dependency to use the code in order to ensure a correct behavior with no errors.

With regular dependencies, you can have multiple versions of the dependency: it's simply installed inside the node_modules of the dependency.

E.g. if `dependency1` and `dependency2` both depend on `dependency3` at different versions , we will have dependecy3 duplicated in diferent versions, which is not a good practice.

But, as peerDependencies require a certain version of a plugin, this problem can be solved and both dependency 1 and 2 can depend on the same version of dependency3. It also can lead to some trobules when two modules require two different versions of the same package, but in this case, the best thing to do is to adapt one of the modules to the version required of the package for the other module.

## When to make a module as a dependency or a devdependency?

There’s actually official guidance on where to put a package, which is clearly written in the [npm documentation](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file). To quote exactly:

* `dependencies`: Packages required by your application in production.
* `devDependencies`: Packages that are only needed for local development and testing.

In short, you should save a module as a devDependency when it’s only used for development and testing; everything else should be a dependency, when it's needed to run the project. This may be straightforward, but things can get murky in real life.

### **The key is:**

It depends. The choice of where to put each module depends not only on the module itself but on your application — and even on the ways it’s developed and deployed.

### **The Guidelines**

Here we will take a look to some easy and dificult cases to see the reasoning for where to put a module.

**There are the simple cases**

There are some clear cases or almost clear. For example:

* Packages like *ESLint* are always devdependency, unless excepcional cases like if you are building a CLI whose job is running ESLint.
* Testing frameworks: Mocha, Jest, etc.
* Code-coverage tools, such as coveralls and nyc.
* Servers used for local development, like serve, htttp-server, etc.
* Documentation tools such as JSDoc.

In node applications there's also a easy rule that says that if a module is imported on the application code (e.g: require or import statements), then it should be a dependency. Anything else goes as devDependency.

But the answer is not that simple in other cases, for example when we're dealing with client-side applications, preprocessed or both.

**Client-Side Applications** 

The toolchain generally includes at least a bundler, in the the case of html-integrations it's webpack, or a task runner (like Grunt), plus a front-end framework like React, Angular, Svelte, or Vue. Additionally, there are often transpilers (such as TypeScript and babel) or other preprocessors (e.g, for CSS and JavaScript files).

When your front-end application is bundled, since they’re only used during the bundling stage, should they all be devDependencies? Strictly following the official documentation, because these packages are used only at build-time, they should be considered devDependencies. However, in doing this, you’ll end up with all your packages as devDependencies.

But that feels like that defeating the point, so let's say it's subjective, depends on the application:

* If your front-end app is deployed together with a back-end app and it’s bundled when the application is started, then bundlers and the rest of the toolchain should be included as dependencies: They are, in fact, needed to launch the application.
* If the front-end application is bundled beforehand, for example in a continuous-integration (CI) server or even on a developer’s machine, then you can consider the dependencies either way.
* Put the packages that are making their way directly into your bundled code into the dependencies block.
For example, modules that are imported by your front-end application and the frameworks themselves, such as React, would all go in the package.json file as dependencies. The bundlers, preprocessors, transpilers, etc. would instead go in as devDependencies.

**Transpiled Server-Side Apps**

With Node.js server-side apps that are transpiled, such as when you’re using TypeScript or babel.

Similarly to the case above, to start from understanding how the application is deployed. Will you run the transpilation before or after deploying it?

For example, if you’re using TypeScript, will you run tsc (the TypeScript transpiler) as a build step before deploying the application or every time you launch the application in the server?

* If you run the transpiler at runtime to start the application, then the transpiler itself and the rest of the toolchain should be dependencies
* If you prebuild the application before deploying it, then you can put the transpilers and the rest of the toolchain as devDependencies.
This is the case when, for example, you’re using a build server to run tsc, you're running it on the developer's machine before copying the transpiled files to the server, or when you're using a multistage Docker-image build where the first stage runs tsc.

**Shipping npm Packages**

This is for example the case of the mathtype packages.

In this case, we need to be particularly careful with keeping the list of dependencies as small as possible. The reason is that when someone installs your package from npm, they’ll install all of its `dependencies` but not the `devDependencies`.

Depending on what technologies you use, packages on npm can either be shipped as is, with unmodified source code or can be preprocessed beforehand.

For example, you normally publish transpiled JavaScript code and the type-definition files.

There are some tips to take into account here:

* No matter what the toolchain (if any) you use to build/transpile/package your code, those packages go as devDependencies.
* If you’re shipping preprocessed code, there’s no need to also get your users to install your preprocessors (transpilers, bundlers, etc.). 
* If you’re shipping the original source code (On the other hand), users will need to use their own preprocessors, and you still shouldn’t make them install what you used for the development and testing of the module.

**Bit of a conlusion**

In those situations, you can’t be sure that all your dependencies and devDependencies are always, at all times, placed in the correct place.

You just have to make sure that there are not security problems due to your decisions or that having duplicate modules does not cause any harm to the project, even though it can happen, it's for that reason that it's recomended to discuss the dependencies every some amount of time.

## When to use peerDependencies?

Peer Dependencies are used to specify that our package is compatible with a specific version of an npm package. Good examples are Angular and React.

To add a Peer Dependency you actually need to manually modify your package.json file. For example, for Angular component library projects, I recommend adding angular/core as a peer dependency. So if you wanted to specify that your package is built for Angular 7, you could include something like this:

```json
"peerDependencies": {
  "@angular/core": "^7.0.0"
}
```

In this case, if someone clones our project in another one that uses Angular 8, it'll conflict because our project is not compatible with Angular 8.

### **The key is:**

We don’t want our library adding another version of a package to node-modules when that package could conflict with an existing version and cause problems

### **The Guidelines**

Favor using Peer Dependencies when one of the following is true:

* Having multiple copies of a package would cause conflicts.
* The dependency is visible in your interface.
* You want the developer to decide which version to install.

When in doubt you should probably lean toward using peerDependencies. This lets the users of your package make their own choice about which packages to add.

