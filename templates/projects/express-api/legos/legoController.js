module.exports.name = 'legoController';
module.exports.dependencies = ['router', 'Lego', 'polyn'];
module.exports.factory = function(router, Lego, polyn) {
    'use strict';

    var legos = [
        new Lego({ color: 'red', width: 2, length: 6, height: 2 }),
        new Lego({ color: 'green', width: 2, length: 6, height: 2 }),
        new Lego({ color: 'blue', width: 2, length: 6, height: 2 })
    ];

    // curl http://localhost:3000/example/legos
    router.get('/example/legos', function (req, res) {
        res.send(legos);
    });

    // curl http://localhost:3000/example/legos/1
    router.get('/example/legos/:i', function (req, res) {
        res.send(legos[parseInt(req.params.i)]);
    });

    // curl "http://localhost:3000/example/legos/" -X POST -H "Content-Type: application/json" -d '{"color":"yellow","width":2,"length":6,"height":2}'
    router.post('/example/legos', function (req, res) {
        var lego = new Lego(req.body);

        if (!lego.isException) {
            legos.push(lego);

            res.status(201)
                .send(lego);
        } else {
            res.status(400)
                .send(lego);
        }
    });

    // curl "http://localhost:3000/example/legos/1" -X PUT -H "Content-Type: application/json" -d '{"color":"yellow","width":2,"length":6,"height":2}'
    router.put('/example/legos/:i', function (req, res) {
        var lego = new Lego(req.body);

        if (!lego.isException) {
            legos[parseInt(req.params.i)] = lego;

            res.status(200)
                .send(lego);
        } else {
            res.status(400)
                .send(lego);
        }
    });

    // curl "http://localhost:3000/example/legos/1" -X DELETE
    router.delete('/example/legos/:i', function (req, res) {
        var i = parseInt(req.params.i),
            message,
            err;

        if (legos.length >= i) {
            legos.splice(i, 1);
            res.status(200).send();
        } else {
            message = 'The index cannot be deleted: it does not exist';
            err = new polyn.Exception(
                'InvalidArgumentException',
                new Error(message),
                [message]
            );

            res.status(400).send(err);
        }
    });

    /* Throw an example error. */
    router.get('/example/error', function(req, res, next) {
        next(new Error('threw example error'));
    });

    return router;
};
