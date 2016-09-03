Hilary.scope('<%= scope %>').register({
    name: 'locale::en_US',
    factory: {
        "nav": [
            {
                "text": "Home",
                "route": "/"
            },
            {
                "text": "Example Route",
                "route": "/gidget/example"
            },
            {
                "text": "Example Route with Params",
                "route": "/gidget/breweries/Straub/beers/Lager"
            },
            {
                "text": "Example Route with Params and Query String",
                "route": "/gidget/breweries/Straub/beers/Amber?s=ambers&t=beers"
            },
            {
                "text": "Example Route with Params, Query String and Hash",
                "route": "/gidget/breweries/Straub/beers/Light?s=lights&t=beers#heading"
            },
            {
                "text": "Example Route with Params and Hash",
                "route": "/gidget/breweries/Straub/beers/GroundHogAltbier#heading"
            },
            {
                "text": "Example 404",
                "route": "/foo"
            }
        ],
        "pages": {
            "home": {
                "heading": "Welcome!",
                "body": "You yo'd up an express app that uses hilary and gidget."
            },
            "example": {
                "heading": "Example Route!",
                "body": "You yo'd up an express app that uses hilary and gidget."
            },
            "errors": {
                "e403": {
                    "heading": "403",
                    "body": "Access denied"
                },
                "e404": {
                    "heading": "404",
                    "body": "{{path}} was not registered on the SPA"
                },
                "e500": {
                    "heading": "Whoops!",
                    "body": "Something went terribly wrong."
                }
            }
        },
        "js": {
            "ViewEngine": {
                "setVM.viewModelRequired": "When setting the mainVM, the viewModel argument must be an object."
            }
        },
        "server": {

        }
    }
});
