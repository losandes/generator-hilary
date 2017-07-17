<%= projectName %>
==========

## Getting Started
This app is composed with [hilary](https://github.com/losandes/hilaryjs), uses [polyn](https://github.com/losandes/polyn) for models, and runs on [express](http://expressjs.com).

To start the app:

```
npm start
```

> NOTE: npm start depends on a global installation of _nodemon_: `npm install -g nodemon`. If you don't wish to install _nodemon_, you car start the app with: `node app.js -e js,hbs`
>
> NOTE: If you chose to install grunt, you must also have grunt installed globally: `npm install -g grunt`. Then you can also start the app with `grunt start`. To find out what else you can do with grunt, run grunt without any arguments: `grunt`.

## Directories
This project is organized, using _type-driven_ folders, as opposed to _capability-driven_ folders. Definitions follow:

> **type-driven folders**: folders that are named after the domain boundaries (i.e. Pricing, Broker, Product, etc.)

> **capability-driven folders**: folders that are named after the job that they perform (i.e. Controllers, Repositories, Models, etc.)

### root
The root of the app includes:

* **app.js**: the entry point of the app
* **composition.js**: where we bootstrap hilary, and compose our dependency graph. It's the [composition root](http://blog.ploeh.dk/2011/07/28/CompositionRoot/) of the app.
* **apis.js**: An index of all the APIs that are to be exposed. This should require the controllers, and anything they depend on. When you add a new type/controller, you can register it and start using it, by requiring it in this file.

### home
The home folder contains the default/home controller, which responds to requests to the root of this API. It renders the README files as HTML. Visit the home page of this API and click, _About_ to learn more.

### legos
The legos folder contains an example API controller and documentation.

### common
The common folder includes code to run the server, as well as utilities that might be used by other modules. There are some files

### common/build-tasks
If you chose to install grunt, the build-tasks folder will contain all of the grunt tasks.

### common/environment
This, git-ignored folder, is where you can define your environment-specific variables. It's also where you register app versions, and README rendering for the home page.

> Note that _environment.js_ exposes a configured instance of [nconf](https://github.com/indexzero/nconf).

### common/error-handling
You'll probably want to edit the `exceptions` module in this directory. It's the default exception handler, and just logs to the console.

### common/express
This API is built on [express](http://expressjs.com), which is configured in this directory. You will also find custom middleware in this directory, for CORS, and API Versioning.

### common/tests
If you chose to install the tests, the tests folder contains modules to help you test with dependencies.

### public
This folder is accessible by the client. This is where you should put any scripts, CSS, or assets that you want clients to have access to.

### views
This folder contains the HBS files, for rendering web pages.
