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
curl "http://localhost:3000/example/legos/" -H "Accept: application/json;version=20150828"
```

```js
fetch('/example/legos', {
    method: 'GET',
    headers: new Headers({
        "Accept": "application/json;version=20150828"
    }),
    mode: 'cors',
}).then(function (res) {
    return res.json();
}).then(function (res) {
    console.log(res);
});
```

> # Example Response `200`

```json
[
    { "color": "red", "width": 2, "length": 6, "height": 2 },
    { "color": "green", "width": 2, "length": 6, "height": 2 },
    { "color": "blue", "width": 2, "length": 6, "height": 2 }
]
```

## Get Lego `GET`

This endpoint retrieves a single Lego `GET http://api.example.com/legos/:id`.

> # Parameters

Name | Type | Description
---- | ---- | -----------
id | int | The id of the lego you wish to retrieve


> # Example Request

```bash
curl "http://localhost:3000/example/legos/0" -H "Accept: application/json;version=20150828"
```

```js
fetch('/example/legos/1', {
    method: 'GET',
    headers: new Headers({
        "Accept": "application/json;version=20150828"
    }),
    mode: 'cors',
}).then(function (res) {
    return res.json();
}).then(function (res) {
    console.log(res);
});
```

> # Example Response `200`

```json
{
    "color": "red",
    "width": 2,
    "length": 6,
    "height": 2
}
```

## Create Lego `POST`

This endpoint creates a Lego `POST http://api.example.com/legos/`.

> # Body

The body of your request should include a [Lego](#legos).


> # Example Request

```bash
curl "http://localhost:3000/example/legos/" /
    -H "Content-Type: application/json" /
    -H "Accept: application/json;version=20150828" /
    -d '{"color":"yellow","width":2,"length":6,"height":2}'
```

```js
fetch('/example/legos', {
    method: 'POST',
    headers: new Headers({
        "Content-Type": "application/json",
        "Accept": "application/json;version=20150828"
    }),
    mode: 'cors',
    body: JSON.stringify({ color: 'yellow', width: 2, length: 6, height: 2 })
}).then(function (res) {
    return res.json();
}).then(function (res) {
    console.log(res);
});
```

> # Example Response `201`

```json
{
    "color": "yellow",
    "width": 2,
    "length": 6,
    "height": 2
}
```

> # Example Response `400`. This response would be generated if you omitted the height property, or if you provided a height that isn't a number.

```json
{
    "type": "InvalidArgumentException",
    "messages": ["This implementation does not satisfy blueprint, Lego. It should have the property, height, with type, number."],
    "isException": true
}
```

## Update Lego `PUT`

This endpoint creates a Lego `PUT http://api.example.com/legos/:id`.

> # Body

The body of your request should include a [Lego](#legos).


> # Example Request

```bash
curl "http://localhost:3000/example/legos/1" \
    -X PUT \
    -H "Content-Type: application/json" \
    -H "Accept: application/json;version=20150828" \
    -d '{"color":"yellow","width":2,"length":6,"height":2}'
```

```js
fetch('/example/legos/0', {
    method: 'PUT',
    headers: new Headers({
        "Accept": "application/json;version=20150828",
        "Content-Type": "application/json"
    }),
    mode: 'cors',
    body: JSON.stringify({ color: 'yellow', width: 2, length: 6, height: 2 })
}).then(function (res) {
    return res.json();
}).then(function (res) {
    console.log(res);
});
```

> # Example Response `200`

```json
{
    "color": "yellow",
    "width": 2,
    "length": 6,
    "height": 2
}
```

> # Example Response `400`. This response would be generated if you omitted the height property, or if you provided a height that isn't a number.

```json
{
    "type": "InvalidArgumentException",
    "messages": ["This implementation does not satisfy blueprint, Lego. It should have the property, height, with type, number."],
    "isException": true
}
```

## Delete Lego `DELETE`

This endpoint deletes a Lego `DELETE http://api.example.com/legos/:id`.


> # Example Request

```bash
curl "http://localhost:3000/example/legos/0" \
    -X DELETE \
    -H "Accept: application/json;version=20150828"
```

```js
fetch('/example/legos/0', {
    method: 'DELETE',
    headers: new Headers({
        "Accept": "application/json;version=20150828"
    }),
    mode: 'cors'
}).then(function (res) {
    console.log(res.status);
});
```

> # Example Response `200`

```json
// no body
```

> # Example Response `400`. This response would be generated if you attempted to delete an id that doesn't exist.

```json
{
    "type": "InvalidArgumentException",
    "messages": ["The index cannot be deleted: it does not exist"],
    "isException": true
}
```
