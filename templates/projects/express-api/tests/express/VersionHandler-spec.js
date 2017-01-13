module.exports.name = 'VersionHandler-spec';
module.exports.dependencies = ['VersionHandlerFactory', 'environment', 'logger', 'async', 'describe', 'describe', 'describe', 'it', 'expect'];
module.exports.factory = function (VersionHandlerFactory, env, logger, async, describe, when, and, it, expect) {
    'use strict';

    var DEFAULT_ACCEPT = 'application/vnd.test.20150920+json',
        ALPHA_ACCEPT = 'application/vnd.test.20150828-alpha+json',
        DEFAULT_HEADER = 'X-test-Media-Type',
        VersionHandler = new VersionHandlerFactory(env, logger);
        // makeMockReq (at the bottom)
        // makeMockRes (at the bottom)

    describe('VersionHandler,', function () {

        when('when we construct a new VersionHandler,', function () {
            var versionHandler = new VersionHandler({
                branches: [{
                    name: 'beta'
                }, {
                    name: 'ga',
                    default: true
                }]
            });

            it('it should accept an array of branches', function (done) {
                versionHandler(makeMockReq(), makeMockRes({
                    onSet: function (res, header, value) {
                        expect(header).to.equal(DEFAULT_HEADER);
                        expect(value).to.equal(DEFAULT_ACCEPT);
                        done();
                    }
                }), function () {});
            });

            it('it should set the version on the response header', function (done) {
                versionHandler(makeMockReq(), makeMockRes({
                    onSet: function (res, header, value) {
                        expect(header).to.equal(DEFAULT_HEADER);
                        expect(value).to.equal(DEFAULT_ACCEPT);
                        done();
                    }
                }), function () {});
            });

            it('it should add the version to res.locals', function (done) {
                versionHandler(makeMockReq(), makeMockRes({
                    onSet: function (res) {
                        expect(res.locals.version.responseHeader).to.equal(DEFAULT_ACCEPT);
                        done();
                    }
                }), function () {});
            });

            and('and no branch is set to default,', function () {
                var versionHandler = new VersionHandler({
                    branches: [{
                        name: 'alpha'
                    }, {
                        name: 'beta'
                    }]
                });

                it('it should use the first branch', function (done) {
                    versionHandler(makeMockReq(), makeMockRes({
                        onSet: function (res, header, value) {
                            expect(header).to.equal(DEFAULT_HEADER);
                            expect(value).to.equal(ALPHA_ACCEPT);
                            done();
                        }
                    }), function () {});
                }); // /it
            }); // /and

            and('and there are versions in the environment, and no branches are defined in the constructor args,', function () {
                var versionHandler = new VersionHandler();

                it('it should discover versions on it\'s own', function (done) {
                    versionHandler(makeMockReq({
                            accept: ALPHA_ACCEPT
                        }), makeMockRes({
                        onSet: function (res, header, value) {
                            expect(header).to.equal(DEFAULT_HEADER);
                            // Note the value will change from app to app, so
                            // this is just making sure the header is set
                            expect(value).to.equal(ALPHA_ACCEPT);
                            done();
                        }
                    }), function () {});
                });

                it('it should set a default version', function (done) {
                    versionHandler(makeMockReq(), makeMockRes({
                        onSet: function (res, header, value) {
                            expect(header).to.equal(DEFAULT_HEADER);
                            expect(value).to.equal('application/vnd.test.20150828-beta+json');
                            done();
                        }
                    }), function () {});
                });
            }); // /and

            and('and there are NOT versions in the environment, and no branches are defined in the constructor args,', function () {
                var VersionHandler = new VersionHandlerFactory(
                        { get: function () { return {}; } },
                        logger
                    ),
                    versionHandler = new VersionHandler();

                it('it should set a default version', function (done) {
                    versionHandler(makeMockReq(), makeMockRes({
                        onSet: function (res, header, value) {
                            expect(header).to.equal('X-Api-Media-Type');
                            // Note the value will change from app to app, so
                            // this is just making sure the header is set
                            expect(typeof value).to.equal('string');
                            done();
                        }
                    }), function () {});
                });
            }); // /and

        }); // /when ctor

        when('when the accept header is not set,', function () {
            var versionHandler = new VersionHandler({
                branches: [{
                    name: 'beta'
                }, {
                    name: 'ga',
                    default: true
                }]
            });

            it('it should use the default version', function (done) {
                versionHandler(makeMockReq({
                        noAcceptHeader: true
                    }),
                    makeMockRes({
                        onSet: function (res, header, value) {
                            expect(res.locals.version.responseHeader).to.equal(DEFAULT_ACCEPT);
                            expect(header).to.equal(DEFAULT_HEADER);
                            expect(value).to.equal(DEFAULT_ACCEPT);
                            done();
                    }
                }), function () {});
            });
        });

        when('when the accept header matches the exact date of a version,', function () {
            var version = env.get('versions').ga[1].responseHeader,
                versionHandler = new VersionHandler({
                    branches: [{
                        name: 'ga',
                        default: true
                    }]
                });

            it('it should use that version', function (done) {
                versionHandler(makeMockReq({
                        accept: version
                    }),
                    makeMockRes({
                        onSet: function (res, header, value) {
                            expect(res.locals.version.responseHeader).to.equal(version);
                            expect(header).to.equal(DEFAULT_HEADER);
                            expect(value).to.equal(version);
                            done();
                    }
                }), function () {});
            });
        });

        when('when the accept header has a date that is after all dated versions,', function () {
            var version = 'application/vnd.test.30000101+json',
                versionHandler = new VersionHandler({
                    branches: [{
                        name: 'ga',
                        default: true
                    }]
                });

            it('it should use the most recent version', function (done) {
                versionHandler(makeMockReq({
                        accept: version
                    }),
                    makeMockRes({
                        onSet: function (res, header, value) {
                            expect(res.locals.version.responseHeader).to.equal(DEFAULT_ACCEPT);
                            expect(header).to.equal(DEFAULT_HEADER);
                            expect(value).to.equal(DEFAULT_ACCEPT);
                            done();
                    }
                }), function () {});
            });
        });

        when('when the accept header has a date that is before all dated versions,', function () {
            var version = 'application/vnd.test.00000101+json';

            it('it should log a warning', function (done) {
                // given
                var VersionHandler = new VersionHandlerFactory(env, {
                        warn: function (err) {
                            // then
                            expect(err.message.indexOf('No version was found') > -1).to.equal(true);
                            done();
                        }
                    }),
                    versionHandler = new VersionHandler({
                        branches: [{
                            name: 'ga',
                            default: true
                        }]
                    });

                versionHandler(makeMockReq({
                        accept: version
                    }),
                    makeMockRes({
                        onSet: function () {
                    }
                }), function () {});
            });

            it('it should set the default version', function (done) {
                // given
                var VersionHandler = new VersionHandlerFactory(env, {
                        warn: function () {
                            // suppress
                        }
                    }),
                    versionHandler = new VersionHandler({
                        branches: [{
                            name: 'ga',
                            default: true
                        }]
                    });

                versionHandler(makeMockReq({
                        accept: version
                    }),
                    makeMockRes({
                        onSet: function (res, header, value) {
                            expect(res.locals.version.responseHeader).to.equal(DEFAULT_ACCEPT);
                            expect(header).to.equal(DEFAULT_HEADER);
                            expect(value).to.equal(DEFAULT_ACCEPT);
                            done();
                    }
                }), function () {});
            });
        });

        when('when the accept header has a date that is between versions,', function () {
            var version = 'application/vnd.test.20150820+json',
                expected = 'application/vnd.test.20150807+json',
                versionHandler = new VersionHandler({
                    branches: [{
                        name: 'ga',
                        default: true
                    }]
                });

            it('it should use the the next version less than the accept date', function (done) {
                versionHandler(makeMockReq({
                        accept: version
                    }),
                    makeMockRes({
                        onSet: function (res, header, value) {
                            expect(res.locals.version.responseHeader).to.equal(expected);
                            expect(header).to.equal(DEFAULT_HEADER);
                            expect(value).to.equal(expected);
                            done();
                    }
                }), function () {});
            });
        });

        when('when the accept header is not in the expected format,', function () {
            var unexpectedFormats = [
                    'foo',
                    'application/json',
                    'application/xml',
                    'application/vnd-test-20150807+json',
                    'application/json+vnd-test-20150807'
                ],
                versionHandler = new VersionHandler({
                    branches: [{
                        name: 'ga',
                        default: true
                    }]
                });

            it('it should use the latest version', function (done) {
                var tasks = unexpectedFormats.map(function (version) {
                    return function (callback) {
                        versionHandler(makeMockReq({
                                accept: version
                            }),
                            makeMockRes({
                                onSet: function (res, header, value) {
                                    expect(value).to.equal(DEFAULT_ACCEPT);
                                    callback();
                            }
                        }), function () {});
                    };
                });

                async.series(tasks, function (err) {
                    expect(err).to.equal(null);
                    done();
                });
            });
        });

        when('when the accept header has a date with other characters in it,', function () {
            and('and the characters are hyphens,', function () {
                var version = 'application/vnd.test.2015-08-07+json',
                    expected = 'application/vnd.test.20150807+json',
                    versionHandler = new VersionHandler({
                        branches: [{
                            name: 'ga',
                            default: true
                        }]
                    });

                it('it should remove the hyphens and succeed in comparing the date', function (done) {
                    versionHandler(makeMockReq({
                            accept: version
                        }),
                        makeMockRes({
                            onSet: function (res, header, value) {
                                expect(res.locals.version.responseHeader).to.equal(expected);
                                expect(header).to.equal(DEFAULT_HEADER);
                                expect(value).to.equal(expected);
                                done();
                        }
                    }), function () {});
                });
            });

            and('and the characters are not expected,', function () {
                var version = 'application/vnd.test.2015.08.07+json',
                    versionHandler = new VersionHandler({
                        branches: [{
                            name: 'ga',
                            default: true
                        }]
                    });

                it('it should use the latest version', function (done) {
                    versionHandler(makeMockReq({
                            accept: version
                        }),
                        makeMockRes({
                            onSet: function (res, header, value) {
                                expect(res.locals.version.responseHeader).to.equal(DEFAULT_ACCEPT);
                                expect(header).to.equal(DEFAULT_HEADER);
                                expect(value).to.equal(DEFAULT_ACCEPT);
                                done();
                        }
                    }), function () {});
                });
            });
        });

        when('when the accept header has a branch tag in it,', function () {
            and('and it matches an existing branch,', function () {
                var version = ALPHA_ACCEPT,
                    versionHandler = new VersionHandler({
                        branches: [{
                            name: 'alpha',
                            default: true
                        }, {
                            name: 'ga',
                            default: true
                        }]
                    });

                it('it should use the latest version', function (done) {
                    versionHandler(makeMockReq({
                            accept: version
                        }),
                        makeMockRes({
                            onSet: function (res, header, value) {
                                expect(res.locals.version.responseHeader).to.equal(ALPHA_ACCEPT);
                                expect(header).to.equal(DEFAULT_HEADER);
                                expect(value).to.equal(ALPHA_ACCEPT);
                                done();
                        }
                    }), function () {});
                });
            });

            and('and it DOES NOT match an existing branch,', function () {
                var version = 'application/vnd.test.20150807-foo+json',
                    versionHandler = new VersionHandler({
                        branches: [{
                            name: 'ga',
                            default: true
                        }]
                    });

                it('it should use the latest version', function (done) {
                    versionHandler(makeMockReq({
                            accept: version
                        }),
                        makeMockRes({
                            onSet: function (res, header, value) {
                                expect(res.locals.version.responseHeader).to.equal(DEFAULT_ACCEPT);
                                expect(header).to.equal(DEFAULT_HEADER);
                                expect(value).to.equal(DEFAULT_ACCEPT);
                                done();
                        }
                    }), function () {});
                });
            });
        });

    }); // /describe

    function makeMockReq (options) {
        options = options || {};

        return {
            get: function () {
                if (options.noAcceptHeader) {
                    return null;
                }

                return options.accept || DEFAULT_ACCEPT;
            }
        };
    }

    function makeMockRes (options) {
        options = options || {};
        // res.locals.version = version;
        // res.set(versions.responseHeader || 'X-Api-Media-Type', version.responseHeader);

        return {
            locals: {
                version: options.version || env.get('versions').ga[0]
            },
            set: function (header, value) {
                options.onSet(this, header, value);
            }
        };
    }

    return true;
};
