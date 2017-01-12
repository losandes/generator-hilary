module.exports.name = 'ExceptionHandler-spec';
module.exports.dependencies = ['Exception', 'ExceptionHandler', 'describe', 'describe', 'describe', 'it', 'expect'];
module.exports.factory = function (Exception, ExceptionHandler, describe, when, and, it, expect) {
    'use strict';

    describe('ExceptionHandler,', function () {

        when('when we construct a new ExceptionHandler,', function () {

            it('it should accept a handler, as the first argument', function (done) {
                // given
                var sut = new ExceptionHandler(function (exception) {
                    // then
                    expect(typeof exception).to.equal('object');
                    done();
                });

                // when
                sut.throw(new Error());
            });

        }); // /when ctor

        when('when we throw an Error object,', function () {

            it('it should convert it to an Exception', function (done) {
                // given
                var expected = 'hello world!',
                    sut = new ExceptionHandler(function (exception) {
                        // then
                        expect(typeof exception).to.equal('object');
                        expect(exception.isException).to.equal(true);
                        expect(exception.error.message).to.equal(expected);
                        expect(exception.messages[0]).to.equal(expected);
                        done();
                    });

                // when
                sut.throw(new Error(expected));
            });

        }); // /when ctor

        when('when we throw an object that matches the Exception signature,', function () {

            it('it should pass it to the exception handler', function (done) {
                // given
                var expected = {
                        type: 'HELLO',
                        message1: 'hello world!',
                        message2: 'foo-bar',
                        data: { foo: 'bar' },
                        causeMessage: 'tril'
                    },
                    sut = new ExceptionHandler(function (exception) {
                        // then
                        expect(typeof exception).to.equal('object');
                        expect(exception.isException).to.equal(true);
                        expect(exception.error.message).to.equal(expected.message1);
                        expect(exception.messages[0]).to.equal(expected.message1);
                        expect(exception.messages[1]).to.equal(expected.message2);
                        expect(exception.data.foo).to.equal(expected.data.foo);
                        expect(exception.cause.message).to.equal(expected.causeMessage);
                        done();
                    });

                // when
                sut.throw(new Exception({
                    type: expected.type,
                    error: new Error(expected.message1),
                    messages: [expected.message1, expected.message2],
                    data: expected.data,
                    cause: new Error(expected.causeMessage)
                }));
            }); // /it

            and('and the error is null, but the messages are an array,', function () {
                it('it should use the first message in the messages array', function (done) {
                    // given
                    var expected = {
                            message1: 'hello world!',
                            message2: 'foo-bar'
                        },
                        sut = new ExceptionHandler(function (exception) {
                            // then
                            expect(typeof exception).to.equal('object');
                            expect(exception.error.message).to.equal(expected.message1);
                            done();
                        });

                    // when
                    sut.throw(new Exception({
                        type: expected.type,
                        messages: [expected.message1, expected.message2]
                    }));
                });
            }); // /and

            and('and the error is null, but the messages are a string,', function () {
                it('it should use the first message in the messages array as the error message', function (done) {
                    // given
                    var expected = {
                            message: 'hello world!'
                        },
                        sut = new ExceptionHandler(function (exception) {
                            // then
                            expect(typeof exception).to.equal('object');
                            expect(exception.error.message).to.equal(expected.message);
                            done();
                        });

                    // when
                    sut.throw(new Exception({
                        messages: expected.message
                    }));
                });
            }); // /and

            and('and neither the error, nor the messages are defined,', function () {
                it('it should set the error message to UNKNOWN', function (done) {
                    // given
                    var expected = {
                            message: 'UNKNOWN'
                        },
                        sut = new ExceptionHandler(function (exception) {
                            // then
                            expect(typeof exception).to.equal('object');
                            expect(exception.error.message).to.equal(expected.message);
                            expect(exception.messages[0]).to.equal(expected.message);
                            done();
                        });

                    // when
                    sut.throw();
                });
            }); // /and

            and('and the messages are a string,', function () {
                it('it should convert messages to an array', function (done) {
                    // given
                    var expected = {
                            message: 'hello world!'
                        },
                        sut = new ExceptionHandler(function (exception) {
                            // then
                            expect(typeof exception).to.equal('object');
                            expect(exception.messages[0]).to.equal(expected.message);
                            done();
                        });

                    // when
                    sut.throw(new Exception({
                        messages: expected.message
                    }));
                });
            }); // /and

            and('and the type is undefined,', function () {
                it('it should set a default type', function (done) {
                    // given
                    var expected = {
                            type: 'EXCEPTION'
                        },
                        sut = new ExceptionHandler(function (exception) {
                            // then
                            expect(typeof exception).to.equal('object');
                            expect(exception.type).to.equal(expected.type);
                            done();
                        });

                    // when
                    sut.throw(new Exception({
                        error: new Error('blah')
                    }));
                });
            }); // /and

        }); // /when

        when('when we throw an Exception object,', function () {

            it('it should pass it to the exception handler', function (done) {
                // given
                var expected = {
                        type: 'HELLO',
                        message1: 'hello world!',
                        message2: 'foo-bar',
                        data: { foo: 'bar' },
                        causeMessage: 'tril'
                    },
                    sut = new ExceptionHandler(function (exception) {
                        // then
                        expect(typeof exception).to.equal('object');
                        expect(exception.isException).to.equal(true);
                        expect(exception.error.message).to.equal(expected.message1);
                        expect(exception.messages[0]).to.equal(expected.message1);
                        expect(exception.messages[1]).to.equal(expected.message2);
                        expect(exception.data.foo).to.equal(expected.data.foo);
                        expect(exception.cause.message).to.equal(expected.causeMessage);
                        done();
                    });

                // when
                sut.throw({
                    type: expected.type,
                    error: new Error(expected.message1),
                    messages: [expected.message1, expected.message2],
                    data: expected.data,
                    cause: new Error(expected.causeMessage)
                });
            });

        }); // /when

    }); // /describe

    return true;
};
