module.exports = {
    "name": "<%= projectName %>",
    "description": "The <%= projectName %> API",
    "version": "0.0.1",
    "main": "app.js",
    "scripts": {
        "start": "nodemon app.js -e js,hbs",
        "install-dependencies": "npm install"
    },
    "dependencies": {
        "async": "^2.1.4",
        "body-parser": "^1.15.2",
        "express": "^4.14.0",
        "hbs": "^4.0.1",
        "helmet": "^3.4.0",
        "highlight.js": "^9.9.0",
        "hilary": "^4.3.1",
        "hpp": "^0.2.1",
        "marked": "^0.3.6",
        "nconf": "^0.8.4",
        "polyn": "^1.6.1",
        "serve-favicon": "^2.3.2",
        "serve-static": "^1.11.1"
    },
    "grunt": {
        "devDependencies": {
            "chalk": "^1.1.3",
            "grunt": "^1.0.1",
            "grunt-cli": "^1.2.0",
            "grunt-contrib-jshint": "^1.1.0",
            "jshint-stylish": "^2.2.1"
        }
    },
    "mocha": {
        "devDependencies": {
            "chai": "^3.5.0",
            "grunt-mocha-test": "^0.13.2",
            "mocha": "^3.2.0"
        }
    }
};
