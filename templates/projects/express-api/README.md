<%= projectName %>
==========

## Getting Started
This app is composed with [hilary](https://github.com/losandes/hilaryjs), uses [polyn](https://github.com/losandes/polyn) for models, and runs on [express](http://expressjs.com).

To start the app:

```
npm start
```

## Directories

### root
The root of the app includes:

* **app.js**: the entry point of the app
* **composition.js**: where we bootstrap hilary, and compose our dependency graph. It's the [composition root](http://blog.ploeh.dk/2011/07/28/CompositionRoot/) of the app.
* **environment.js**: exposes a configured instance of [nconf](https://github.com/indexzero/nconf).

### api
The api directory is where you put the app code, including controllers, and models. It's subfolders are delineated by domain (i.e. users, legos), rather than by aspect (i.e. controllers, models), to make it easier for readers/developers get a sense of what the app does.

The homeController renders the README files as HTML. Visit the home page of this API and click, _About_ to learn more.

### environment
This, git-ignored folder, is where you can define your environment-specific variables. It's also where you register app versions, and README rendering for the home page.

### errorHandling
You'll probably want to edit the `exceptions` module in this directory. It's the default exception handler, and just logs to the console.

### express
This API is built on [express](http://expressjs.com), which is configured in this directory. You will also find custom middleware in this directory, for CORS, and API Versioning.

### public
This folder is accessible by the client. This is where you should put any scripts, CSS, or assets that you want clients to have access to.

### views
This folder contains the HBS files, for rendering web pages.
