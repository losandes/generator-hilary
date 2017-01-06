# Legos

#### This section provides an example for documenting a data-type.

Legos `/example/legos` are ... They have the following schema:

Property | Type | Description
---- | ---- | -----------
color | string | The color of the lego
width | int | The number of connectors the lego has, in width
length | int | The number of connectors the lego has, in length
height | int | An integer representation of the height

> # Example Lego

```json
{
    "color": "red",
    "width": 2,
    "length": 6,
    "height": 2
}
```

## List Legos `GET`

This endpoint retrieves all Legos `GET http://api.example.com/legos/`.

> # Example Request

```bash
curl "http://localhost:3000/example/legos/" -H "Accept: application/vnd.example.20150828+json"
```

```js
$.ajax({
    type: 'GET',
    url: '/example/legos/',
    dataType: 'json',
    crossDomain: true
}).done(function (data, status, jqXhr) {
    console.log(data);
});
```

> # Example Response `200`

```json
{
    "status": 200,
    "payload": [
        { "color": "red", "width": 2, "length": 6, "height": 2 },
        { "color": "green", "width": 2, "length": 6, "height": 2 },
        { "color": "blue", "width": 2, "length": 6, "height": 2 }
    ]
}
```

## Get Lego `GET`

This endpoint retrieves a single Lego `GET http://api.example.com/legos/:id`.

> # Parameters

Name | Type | Description
---- | ---- | -----------
id | int | The id of the lego you wish to retrieve


> # Example Request

```bash
curl "http://localhost:3000/example/legos/0" -H "Accept: application/vnd.example.20150828+json"
```

```js
$.ajax({
    type: 'GET',
    url: '/example/legos/1',
    dataType: 'json',
    crossDomain: true
}).done(function (data, status, jqXhr) {
    console.log(data);
});
```

> # Example Response `200`

```json
{
    "status": 200,
    "payload": {
        "color": "red",
        "width": 2,
        "length": 6,
        "height": 2
    }
}
```

## Create Lego `POST`

This endpoint creates a Lego `POST http://api.example.com/legos/`.

> # Body

The body of your request should include a [Lego](#legos).


> # Example Request

```bash
curl "http://localhost:3000/example/legos/" \
    -H "Accept: application/vnd.example.20150828+json" \
    -d color="yellow" \
    -d width=2 \
    -d length=6 \
    -d height=2
```

```js
$.ajax({
    type: 'POST',
    url: '/example/legos',
    data: { color: 'yellow', width: 2, length: 6, height: 2 },
    dataType: 'json',
    crossDomain: true
}).done(function (data, status, jqXhr) {
    console.log(data);
});
```

> # Example Response `201`

```json
{
    "status": 200,
    "payload": {
        "color": "yellow",
        "width": 2,
        "length": 6,
        "height": 2
    }
}
```

## Update Lego `PUT`

This endpoint creates a Lego `PUT http://api.example.com/legos/:id`.

> # Body

The body of your request should include a [Lego](#legos).


> # Example Request

```bash
curl "http://localhost:3000/example/legos/0" \
    -X PUT \
    -H "Accept: application/vnd.example.20150828+json" \
    -d color="yellow" \
    -d width=2 \
    -d length=6 \
    -d height=2
```

```js
$.ajax({
    type: 'PUT',
    url: '/example/legos/0',
    data: { color: 'yellow', width: 2, length: 6, height: 2 },
    dataType: 'json',
    crossDomain: true
}).done(function (data, status, jqXhr) {
    console.log(data);
});
```

> # Example Response `200`

```json
{
    "status": 200,
    "payload": {
        "color": "yellow",
        "width": 2,
        "length": 6,
        "height": 2
    }
}
```

## Delete Lego `DELETE`

This endpoint deletes a Lego `DELETE http://api.example.com/legos/:id`.


> # Example Request

```bash
curl "http://localhost:3000/example/legos/0" \
    -X DELETE \
    -H "Accept: application/vnd.example.20150828+json"
```

```js
$.ajax({
    type: 'DELETE',
    url: '/example/legos/0',
    dataType: 'json',
    crossDomain: true
}).done(function (data, status, jqXhr) {
    console.log(data);
});
```

> # Example Response `200`

```json
{
    "status": 200
}
```
