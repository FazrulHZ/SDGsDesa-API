exports.ok = function (values, res) {
    var data = {
        'status': 200,
        'data': values
    };

    res.json(data);
    res.end();
};

exports.error404 = function (res) {
    var data = {
        'status': 404,
        'data': 'empty.'
    };

    res.status(404);
    res.json(data);
    res.end();
};

exports.error = function (values, res) {
    var data = {
        'status': 500,
        'data': values
    };

    res.status(500);
    res.json(data);
    res.end();
};