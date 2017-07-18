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

```endpoint
{
    "method": "GET",
    "protocol": "http",
    "host": "localhost:3000",
    "path": "/example/legos",
    "headers": {
        "Accept": "application/json;version=20150828",
        "Cache-Control": "no-cache"
    }
}
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

```endpoint
{
    "method": "GET",
    "protocol": "http",
    "host": "localhost:3000",
    "path": "/example/legos/1",
    "headers": {
        "Accept": "application/json;version=20150828",
        "Cache-Control": "no-cache"
    }
}
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

```endpoint
{
    "method": "POST",
    "protocol": "http",
    "host": "localhost:3000",
    "path": "/example/legos",
    "headers": {
        "Accept": "application/json;version=20150828",
        "Cache-Control": "no-cache"
    },
    "body": "{ \"color\": \"yellow\", \"width\": 2, \"length\": 6, \"height\": 2 }"
}
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

```endpoint
{
    "method": "PUT",
    "protocol": "http",
    "host": "localhost:3000",
    "path": "/example/legos/1",
    "headers": {
        "Accept": "application/json;version=20150828",
        "Cache-Control": "no-cache"
    },
    "body": "{ \"color\": \"yellow\", \"width\": 2, \"length\": 6, \"height\": 2 }"
}
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

```endpoint
{
    "method": "DELETE",
    "protocol": "http",
    "host": "localhost:3000",
    "path": "/example/legos/1",
    "headers": {
        "Accept": "application/json;version=20150828",
        "Cache-Control": "no-cache"
    }
}
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
