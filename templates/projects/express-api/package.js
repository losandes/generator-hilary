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
        "async": "^2.5.0",
        "body-parser": "^1.17.2",
        "bson-objectid": "^1.1.5",
        "express": "^4.15.3",
        "hbs": "^4.0.1",
        "helmet": "^3.6.1",
        "highlight.js": "^9.12.0",
        "hilary": "^5.0.0",
        "hpp": "^0.2.2",
        "marked": "^0.3.6",
        "nconf": "^0.8.4",
        "polyn": "^1.*",
        "serve-favicon": "^2.4.3",
        "serve-static": "^1.12.3"
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
    "tests": {
        "devDependencies": {
            "grunt-vows": "^0.4.2",
            "vows": "^0.8.1"
        }
    }
};
