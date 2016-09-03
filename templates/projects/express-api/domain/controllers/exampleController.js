module.exports.name = 'exampleController';
module.exports.dependencies = ['router'];
module.exports.factory = function(router) {
    'use strict';

    var legos = [
        { color: 'red', width: 2, length: 6, height: 2 },
        { color: 'green', width: 2, length: 6, height: 2 },
        { color: 'blue', width: 2, length: 6, height: 2 }
    ];

    // curl http://localhost:3000/example/legos
    router.get('/example/legos', function (req, res) {
        res.send({ status: 200, payload: legos });
    });

    // curl http://localhost:3000/example/legos/1
    router.get('/example/legos/:i', function (req, res) {
        res.send({ status: 200, payload: legos[parseInt(req.params.i)] });
    });

    // curl http://localhost:3000/example/legos -d color="yellow" -d width=2 -d length=6 -d height=2
    router.post('/example/legos', function (req, res) {
        legos.push(req.body);
        res.status(201)
            .send({ status: 201, payload: legos.pop() });
    });

    router.put('/example/legos/:i', function (req, res, next) {
        var i = parseInt(req.params.i);

        legos[i] = req.body;
        res.status(200).send({ status: 200, payload: legos[i] });
    });

    router.delete('/example/legos/:i', function (req, res) {
        legos.splice(parseInt(req.params.i), 1);
        res.send({ status: 200 });
    });

    /* Throw an example error. */
    router.get('/example/error', function(req, res, next) {
        next(new Error('threw example error'));
    });

    return router;
};
