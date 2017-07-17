module.exports.name = 'ExceptionHandler-spec';
module.exports.dependencies = ['Exception', 'ExceptionHandler', 'vows', 'assert'];
module.exports.factory = function (Exception, ExceptionHandler, vows, assert) {
    // jshint validthis:true, unused:false
    'use strict';

    return vows.describe('ExceptionHandler').addBatch({
        'when we construct a new ExceptionHandler': {
            topic: constructTopic,
            'it should accept a handler, as the first argument': constructAssertions
        },
        'when an instance of Error is thrown': {
            topic: throwErrorTopic,
            'it should convert it to an Exception': throwErrorAssertions
        },
        'when an instance of Exception is thrown': {
            topic: throwException,
            'it should pass it to the exception handler': throwExceptionAssertions,
            'and the error is null, but the messages are an array': {
                topic: throwExceptionNullErrorMsgArrayTopic,
                'it should use the first message in the messages array': throwExceptionNullErrorMsgArrayAssertions
            },
            'and the error is null, but the messages are a string': {
                topic: throwExceptionNullErrorMsgStringTopic,
                'it should use the first message in the messages array as the error message': throwExceptionNullErrorMsgStringAssertions,
                'it should convert messages to an array': throwExceptionNullErrorMsgStringConvertsToArray
            },
            'and the type is undefined': {
                topic: throwExceptionUndefinedTypeTopic,
                'it should set a default type': throwExceptionUndefinedTypeAssertions
            }
        },
        'when an object that is recognizable as an Exception signature is thrown': {
            topic: throwObjectTopic,
            'it should pass it to the exception handler': throwObjectAssertions
        },
        'when throw is called without arguments': {
            topic: throwExceptionNullErrorAndMsgTopic,
            'it should generate an error and set the message to UNKNOWN': throwExceptionNullErrorAndMsgAssertions
        }
    });

    function constructTopic () {
        // given
        var sut = new ExceptionHandler(this.callback);

        // when
        sut.throw(new Error());
    }

    function constructAssertions (err, ignore /* needed for vows */) {
        assert.typeOf(err, 'object');
    }

    function throwErrorTopic () {
        // given
        var self = this,
            expected = 'hello world!',
            sut = new ExceptionHandler(function (err) {
                self.callback(err, expected);
            });

        // when
        sut.throw(new Error('hello world!'));
    }

    function throwErrorAssertions (err, expected) {
        assert.typeOf(err, 'object');
        assert.equal(err.isException, true);
        assert.equal(err.error.message, expected);
        assert.equal(err.messages[0], expected);
    }

    function throwException () {
        // given
        var self = this,
            expected = {
                type: 'HELLO',
                message1: 'hello world!',
                message2: 'foo-bar',
                data: { foo: 'bar' },
                causeMessage: 'tril'
            },
            sut = new ExceptionHandler(function (err) {
                self.callback(err, expected);
            });

        // when
        sut.throw(new Exception({
            type: expected.type,
            error: new Error(expected.message1),
            messages: [expected.message1, expected.message2],
            data: expected.data,
            cause: new Error(expected.causeMessage)
        }));
    }

    function throwExceptionAssertions (err, expected) {
        assert.typeOf(err, 'object');
        assert.equal(err.isException, true);
        assert.equal(err.error.message, expected.message1);
        assert.equal(err.messages[0], expected.message1);
        assert.equal(err.messages[1], expected.message2);
        assert.equal(err.data.foo, expected.data.foo);
        assert.equal(err.cause.message, expected.causeMessage);
    }

    function throwExceptionNullErrorMsgArrayTopic () {
        // given
        var self = this,
            expected = {
                message1: 'hello world!',
                message2: 'foo-bar'
            },
            sut = new ExceptionHandler(function (exception) {
                self.callback(exception, expected);
            });

        // when
        sut.throw(new Exception({
            type: expected.type,
            messages: [expected.message1, expected.message2]
        }));
    }

    function throwExceptionNullErrorMsgArrayAssertions (err, expected) {
        assert.typeOf(err, 'object');
        assert.equal(err.error.message, expected.message1);
    }

    function throwExceptionNullErrorMsgStringTopic() {
        var self = this,
            expected = {
                message: 'hello world!'
            },
            sut = new ExceptionHandler(function (exception) {
                self.callback(exception, expected);
            });

        // when
        sut.throw(new Exception({
            messages: expected.message
        }));
    }

    function throwExceptionNullErrorMsgStringAssertions (err, expected) {
        assert.typeOf(err, 'object');
        assert.equal(err.error.message, expected.message);
    }

    function throwExceptionNullErrorMsgStringConvertsToArray (err, expected) {
        assert.typeOf(err, 'object');
        assert.equal(err.messages[0], expected.message);
    }

    function throwExceptionNullErrorAndMsgTopic () {
        // given
        var sut = new ExceptionHandler(this.callback);

        // when
        sut.throw();
    }

    function throwExceptionNullErrorAndMsgAssertions (err, ignore /* needed for vows */) {
        assert.typeOf(err, 'object');
        assert.equal(err.error.message, 'UNKNOWN');
        assert.equal(err.messages[0], 'UNKNOWN');
    }

    function throwExceptionUndefinedTypeTopic () {
        // given
        var sut = new ExceptionHandler(this.callback);

        // when
        sut.throw({
            error: new Error('blah')
        });
    }

    function throwExceptionUndefinedTypeAssertions (err, ignore /* needed for vows */) {
        assert.typeOf(err, 'object');
        assert.equal(err.type, 'EXCEPTION');
    }

    function throwObjectTopic () {
        // given
        var self = this,
            expected = {
                type: 'HELLO',
                message1: 'hello world!',
                message2: 'foo-bar',
                data: { foo: 'bar' },
                causeMessage: 'tril'
            },
            sut = new ExceptionHandler(function (exception) {
                self.callback(exception, expected);
            });

        // when
        sut.throw({
            type: expected.type,
            error: new Error(expected.message1),
            messages: [expected.message1, expected.message2],
            data: expected.data,
            cause: new Error(expected.causeMessage)
        });
    }

    function throwObjectAssertions (err, expected) {
        assert.typeOf(err, 'object');
        assert.equal(err.isException, true);
        assert.equal(err.error.message, expected.message1);
        assert.equal(err.messages[0], expected.message1);
        assert.equal(err.messages[1], expected.message2);
        assert.equal(err.data.foo, expected.data.foo);
        assert.equal(err.cause.message, expected.causeMessage);
    }
};
