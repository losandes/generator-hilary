(function ($, ko, window, document) {
    'use strict';

    var docsVm = {
            NavVm: undefined,
            activeVm: undefined,
            init: undefined
        },
        NavVm,
        MenuItemVm,
        makeNavVm,
        Language,
        toggleLanguage,
        toggleLanguageByUri,
        bootstrapperizeIt,
        init;

    NavVm = function (nav) {
        var self = this,
            languages = [],
            i;
        nav = nav || {};

        self.title = nav.title;
        self.logo = nav.logoPath;
        self.menuItems = [];
        self.languages = [];
        self.languageDict = {};
        self.showLanguageMenu = ko.observable(false);

        self.addMenuItem = function (item) {
            self.menuItems.push(new MenuItemVm(item));
        };

        self.addLanguage = function (lang) {
            var language = new Language(lang);
            self.languages.push(language);
            self.languageDict[language.preName] = language;
            self.showLanguageMenu(true);
        };

        self.setActiveLanguage = function (lang) {
            var i;

            for (i = 0; i < self.languages.length; i += 1) {
                if (self.languages[i].preName === lang) {
                    self.languages[i].setStatus(true);
                } else {
                    self.languages[i].setStatus(false);
                }
            }
        };

        if (nav && nav.menuItems && nav.menuItems.length) {
            for (i = 0 ; i < nav.menuItems.length; i += 1) {
                self.addMenuItem(nav.menuItems[i]);
            }
        }

        if (typeof nav.languages === 'string') {
            try {
                languages = JSON.parse(nav.languages.replace(/&quot;/g, '"'));
            } catch (e) {
                // ignore
            }
        } else if (Array.isArray(nav.languages)) {
            languages = nav.languages;
        }

        if (Array.isArray(languages)) {
            for (i = 0 ; i < languages.length; i += 1) {
                self.addLanguage(languages[i]);
            }
        }
    };

    MenuItemVm = function (item) {
        var self = this;

        self.name = item.name || 'Resource';
        self.link = item.link || '#';
    };

    // { "name": "All", "preName": "language-any" },
    // { "name": "Shell", "preName": "language-bash" },
    // { "name": "JavaScript", "preName": "language-js" }
    Language = function (lang) {
        var self = this;

        self.name = lang.name;
        self.preName = lang.preName;
        self.link = '/docs/' + self.preName;
        self.css = ko.observable();
        self.click = function () {
            var link = self.link;

            if (window.location.hash) {
                link += window.location.hash;
            }

            history.pushState({ uri: link }, document.title, link);
            toggleLanguage(self.preName);
            //docsVm.activeVm.setActiveLanguage(self.preName);
        };

        self.setStatus = function (isActive) {
            if (isActive) {
                self.css('active');
            } else {
                self.css('');
            }
        };

        self.setStatus(lang.isActive);
    };

    makeNavVm = function (options) {
        var vm = new NavVm(options);

        $('h1').each(function (i, e) {
            var $this = $(e);

            if ($this.parent()[0].tagName !== 'BLOCKQUOTE') {
                vm.addMenuItem({
                    name: $this.text(),
                    link: '#' + e.id
                });
            }
        });

        return vm;
    };

    toggleLanguage = function (lang) {
        var activeVm = docsVm.activeVm,
            getHandles,
            hideAllLangBlocks,
            showLangBlocks;

        getHandles = function (langs) {
            var langHandles = [],
                i;

            for (i = 0; i < langs.length; i += 1) {
                langHandles.push(langs[i].preName);
            }

            return langHandles;
        };

        hideAllLangBlocks = function (langDict) {
            var pres, pre, block, i;

            pres = document.querySelectorAll('pre');

            for (i = 0; i < pres.length; i += 1) {
                pre = pres[i];
                block = $(pre).children('[class^="lang"]')[0];

                if (block && langDict[block.className]) {
                    // if the code block was processed by highlight.js
                    // and the className is in our language dictionary
                    // (which also implies it't not already "out")
                    // (we only want to take action on the languages that
                    // users can choose from, otherwise we'll hide things they
                    // have not way of recovering)
                    // hide it
                    $(pre).addClass('out');
                }
            }
        };

        showLangBlocks = function (langHandles, lang) {
            var pre, blocks, i, j;

            for (i = 0; i < langHandles.length; i += 1) {
                blocks = document.querySelectorAll('.' + langHandles[i]);

                for (j = 0; j < blocks.length; j += 1) {
                    pre = $(blocks[j]).parent('pre');

                    if (lang === 'lang-all' || lang === langHandles[i]) {
                        pre.removeClass('out');
                    }
                }
            }
        };

        activeVm.setActiveLanguage(lang);
        hideAllLangBlocks(activeVm.languageDict);
        showLangBlocks(getHandles(activeVm.languages), lang);
    };

    toggleLanguageByUri = function () {
        var path = window.location.pathname;

        if (path.indexOf('lang') > -1) {
            toggleLanguage(path.split('/').pop());
        }
    };

    bootstrapperizeIt = function (options) {
        $('table').addClass('table').addClass('table-striped').addClass('table-bordered');

        if (options.useHeadingAlerts !== false) {
            $('h4').addClass('alert').addClass('alert-info');
            $('h5').addClass('alert').addClass('alert-danger');
        }
    };

    init = function (options) {
        var vm = makeNavVm(options);
        options = options || {};

        docsVm.activeVm = vm;
        toggleLanguageByUri();

        ko.applyBindings(vm, $('nav')[0]);

        bootstrapperizeIt(options);
    };


    docsVm.NavVm = NavVm;
    docsVm.init = init;

    window.docsVm = docsVm;

}(jQuery, ko, window, document));
