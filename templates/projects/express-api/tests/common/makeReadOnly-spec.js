module.exports.name = 'makeReadOnly-spec';
module.exports.dependencies = ['common-makeReadOnly', 'logger', 'ObjectID', 'describe', 'describe', 'describe', 'it', 'expect'];
module.exports.factory = function (makeReadOnly, logger, ObjectID, describe, when, and, it, expect) {
    'use strict';

    describe('makeReadOnly', function () {
        when('when makeImmutable is followed by on', function () {

            it('it should set a property on the given object', function () {
                var given = {};
                makeReadOnly('foo', 42).on(given);
                expect(given.foo).to.equal(42);
            });

            it('the given property should be read-only', function () {
                var given = {};
                makeReadOnly('foo', 42).on(given);
                given.foo = 44;
                expect(given.foo).to.equal(42);
            });

            and('and the object is not defined', function () {
                it('it should throw', function () {
                    try {
                        makeReadOnly('foo', 42).on(null);
                        expect('if we got here the test failed').to.equal(false);
                    } catch (e) {
                        expect(e).to.not.equal(undefined);
                    }
                });
            });
        }); // /when

        when('when makeImmutable is followed by withSetMessage', function () {
            it('it should use that error message when code tries to set the read-only property', function () {
                var given = {},
                    expected = new ObjectID().toString();

                makeReadOnly('foo', 42)
                    .withSetMessage(expected)
                    .on(given);

                given.foo = 44;

                expect(logger.findByMessage(expected).length).to.equal(1);
            });
        }); // /when

    }); // /describe

    return true;
};
