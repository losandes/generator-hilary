(function(window, document) {
    'use strict';

    var docs,
        collapseNavItem,
        expandNavItem,
        languageHandles = {},
        addLanguageHandle,
        makeLanguageHandler,
        parseQueryString;

    docs = {
        /*
        // Determine if a string ends with another string.
        */
        endsWith: undefined,

        /*
        // Get an array [width, height] of the window.
        */
        getWindowDimentions: undefined,

        /*
        // Collapse or show a request/response example.
        */
        toggleCollapseButton: undefined,

        /*
        // Collapse or show a navigation menu. It will not be hidden unless it
        // is currently selected or `force` has been passed.
        */
        toggleCollapseNav: undefined,

        /*
        // Collapses all top-level items in the navigation menu
        */
        collapseAllNavItems: undefined,

        /*
        // Highlight the selected language, and turn highlight off on others
        */
        toggleLanguageLink: undefined,

        /*
        // Hide other syntax examples in favor of a single language
        // All languages are shown by default
        */
        toggleLanguage: undefined,

        /*
        // expand all examples that are hidden or hide all that are shown
        */
        toggleAllExamples: undefined,

        /*
        // Refresh the page after a live update from the server. This only
        // works in live preview mode (using the `--server` parameter).
        */
        refresh: undefined,

        /*
        // Initialize the interactive functionality of the page.
        */
        init: undefined
    };

    collapseNavItem = function (el) {
        el.className = el.className.replace(' in', '');
        el.style.maxHeight = '0px';
    };

    expandNavItem = function (el) {
        if (el && el.children) {
            var inner = el.children[0];

            docs.collapseAllNavItems();
            el.className = el.className + ' in';
            el.style.maxHeight = inner.offsetHeight + 12 + 'px';
        }
    };

    addLanguageHandle = function (handle) {
        languageHandles[handle] = true;
    };

    makeLanguageHandler = function (el, handle) {
        return function () {
            var uri, newUrl;

            docs.toggleLanguageLink(el);
            docs.toggleLanguage(handle);

            uri = window.location;
            newUrl = uri.origin;
            newUrl += '/?lang=' + handle;
            newUrl += uri.hash;

            history.pushState({ uri: newUrl }, document.title, newUrl);
        };
    };

    parseQueryString = function () {
        var parser = /(?:^|&)([^&=]*)=?([^&]*)/g,
            queryString = (window.location.search + '').substring(1),
            query = {},
            link;

        queryString.replace(parser,  function ($0, $1, $2) {
            if ($1) {
                query[$1] = $2;
            }
        });

        if (query.lang) {
            link = document.querySelector('a[data-pre-name="' + query.lang + '"]');
            if (link) {
                link.click();
            }
        }
    };

    docs.endsWith = function (str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    };

    docs.getWindowDimensions = function () {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.body,
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight;

        return [x, y];
    };

    docs.toggleCollapseButton = function (event) {
        var button, content, inner;

        button = event.target.className.indexOf('collapse-button') > -1 ? event.target : event.target.parentNode;

        if (button.className.indexOf('collapse-button') === -1) {
            // Clicked without hitting the right element?
            return;
        }

        content = button.parentNode.nextSibling;
        inner = content.children[0];

        if (button.className.indexOf('in') > -1) {
            // Currently showing, so let's hide it
            button.className = button.className.replace(' in', '');
            content.className = content.className.replace(' in', '');
            content.style.maxHeight = '0px';
        } else {
            // Currently hidden, so let's show it
            button.className = button.className + ' in';
            content.className = content.className + ' in';
            content.style.maxHeight = inner.offsetHeight + 12 + 'px';
        }
    };

    docs.toggleCollapseNav = function (event, force) {
        var heading = event.target.parentNode,
            content = heading.nextSibling;

        if (heading.className.indexOf('heading') === -1 || content.className.indexOf('collapse-content') === -1) {
            // Clicked without hitting the right element?
            return;
        }

        if (content.className.indexOf('in') > -1) {
            // Currently showing, so let's hide it, but only if this nav item
            // is already selected. This prevents newly selected items from
            // collapsing in an annoying fashion.
            if (force || window.location.hash && docs.endsWith(event.target.href, window.location.hash)) {
                collapseNavItem(content);
            }
        } else {
            // Currently hidden, so let's show it
            expandNavItem(content);
        }
    };

    docs.collapseAllNavItems = function () {
        var navItems = document.querySelectorAll('.resource-group .heading'),
            i;

        for (i = 0; i < navItems.length; i += 1) {
            collapseNavItem(navItems[i].nextSibling);
        }
    };

    docs.toggleLanguageLink = function (el, lang) {
        var links, i;

        if (!el) {
            return;
        }

        links = document.querySelectorAll('.lang');

        for (i = 0; i < links.length; i += 1) {
            if (links[i].dataset.preName !== 'lang') {
                links[i].className = links[i].className.replace(' in', '');
            }
        }

        el.className = el.className + ' in';
    };

    docs.toggleLanguage = function (lang) {
        var allBlocks, currentBlock, currentPre, currentIsAnOption, currentIsSelected, currentIsShown, i, j, matchCount;

        allBlocks = document.querySelectorAll('code[class^="language"]');

        for (i = 0; i < allBlocks.length; i += 1) {
            currentBlock = allBlocks[i];
            currentPre = currentBlock.parentElement;
            currentIsSelected = currentBlock.className.indexOf(lang) > -1;
            currentIsShown = currentPre.className.indexOf('out') === -1;
            // this isn't perfect - if the current block has more than one class, this will break
            currentIsAnOption = languageHandles[currentBlock.className];

            if (lang === 'language-any') {
                currentPre.className = currentPre.className.replace(' out', '');
            } else if ((currentIsSelected && currentIsShown) || !currentIsAnOption) {
                // ignore
            } else if (currentIsSelected && !currentIsShown) {
                currentPre.className = currentPre.className.replace(' out', '');
            } else if (currentIsShown) {
                currentPre.className = currentPre.className + ' out';
            }
        }
    };

    docs.toggleAllExamples = function (show) {
        var examples,
            i;

        examples = show ? document.querySelectorAll('.content .collapse-button:not(.in)') :
            document.querySelectorAll('.content .collapse-button.in');

        for (i = 0; i < examples.length; i += 1) {
            examples[i].click();
        }
    };

    docs.refresh = function (body) {
        document.querySelector('body').className = 'preload';
        document.body.innerHTML = body;

        // Re-initialize the page
        docs.init();

        document.querySelector('body').className = '';
    };

    docs.init = function () {
        var navItems, buttons, languages, currentLang, queryStringLang, i;

        // Make collapse buttons clickable
        buttons = document.querySelectorAll('.collapse-button');
        for (i = 0; i < buttons.length; i++) {
            buttons[i].onclick = docs.toggleCollapseButton;
        }

        // Make nav items clickable to collapse/expand their content.
        navItems = document.querySelectorAll('nav .resource-group .heading');
        for (i = 0; i < navItems.length; i++) {
            navItems[i].onclick = docs.toggleCollapseNav;
        }

        languages = document.querySelectorAll('.lang');
        for (i = 0; i < languages.length; i++) {
            currentLang = languages[i].getAttribute('data-pre-name');
            addLanguageHandle(currentLang);
            languages[i].onclick = makeLanguageHandler(languages[i], currentLang);
        }

        parseQueryString();

        document.querySelector('.toggle-examples').onclick = function (event) {
            var button = event.target,
                show = button.className.indexOf('in') === -1;

            if (show) {
                docs.toggleAllExamples(true);
                button.className = button.className + ' in';
            } else {
                docs.toggleAllExamples(false);
                button.className = button.className.replace(' in', '');
            }
        };
    };


    // Initial call to set up buttons
    docs.init();

    window.onload = function() {
        // Remove the `preload` class to enable animations
        document.querySelector('body').className = '';

        if (window.location.hash) {
            var link = document.querySelector('[href="' + window.location.hash + '"]'),
                el = link.parentElement.nextSibling;

            expandNavItem(el);
        }
    };

}(window, document));
