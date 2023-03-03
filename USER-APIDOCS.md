## Register

### POST / Register

- Request

_Body_

```json
{
  "username": "String",
  "email": "String",
  "phone": "String",
  "fullName": "String",
  "password": "String",
  "city_id": "Integer",
  "address": "Text",
  "imageProfile": "String"
}
```

- Response

_Body 201-CREATED_

```json
{
  "username": "String",
  "message": "Success Created"
}
```

_Body 400-BAD REQUEST_

```json
{
  "message": "name is require"
}
or
{
  "message": "email is require"
}
or
{
  "message": "phone is require"
}
or
{
  "message": "fullName is require"
}
or
{
  "message": "city is require"
}
or
{
  "message": "address is require"
}
or
{
  "message": "image Profile is require"
}

```

## Login

### POST /login

- Request

_Body_

```json
{
  "email": "String",
  "Password": "String"
}
```

- Response

_Body (200-OK)_

```json
{
  "name": "String",
  "email": "String",
  "access_key": "String"
}
```

_Body (400-BAD REQUEST)_

```json
{
    "message":"email is require",
}
or
{
    "message":"password is require"
}
```

_Body (403-FORBIDDEN)_

```json
{
  "message": "invalid email or password"
}
```

## User All

### GET /users

- Request

_Headers_

```json
{
  "access_key": "String"
}
```

- Response

_Body (200-OK)_

```json
[
  {
  "name": "String",
  "email": "String",
  "fullName": "String",
  "city_id": "Integer",
  "imageProfile": "String"
  }
  ....
]
```

## User By ID

### GET /users/:id

- Request

_Header_

```json
{
  "access_key": "String"
}
```

- Response

_Body (200-OK)_

```json
{
  "username": "String",
  "email": "String",
  "phone": "String",
  "fullName": "String",
  "city_id": "Integer",
  "address": "Integer",
  "imageProfile": "String",
  "balance": "Integer"
}
```

## Global Error

### Description

#### Don't have Token or wrong Token access

- Response

_Body (401- unauthorized)_

```json
{
  "message": "Invalid Token"
}
```

### Description

- Response (500 - Internal Server Error)

```json
{
  "message": "Internal server error"
}
```
