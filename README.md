# Fritter Backend

Backend for Fritter assignment in MIT 6.1040. The following are the API routes implemented.

## `GET /`

Renders the `index.html` file that will be used to interact with the backend

## `GET /api/freets` - Get all freets

**Returns**

- An array of all freets sorted in descending order by date modified. Does not include freets that logged in user does not have access to.

**Throws**

- `403` if the user is not logged in

## `GET /api/freets?feed` - Get all freets from following

**Returns**

- An array of all freets authored by users that logged in user follows sorted in descending order by date modified. Does not include freets that logged in user does not have access to.

**Throws**

- `403` if the user is not logged in

## `GET /api/freets?author=USERNAME` - Get freets by author

**Returns**

- An array of freets created by user with username `author`. Does not include freets that logged in user does not have access to.

**Throws**

- `403` if the user is not logged in
- `400` if `author` is not given
- `404` if `author` is not a recognized username of any user

## `POST /api/freets` - Create a new freet

**Body**

- `content` *{string}* - The content of the freet

**Returns**

- A success message
- An object with the created freet

**Throws**

- `403` if the user is not logged in
- `400` If the freet content is empty or a stream of empty spaces
- `413` If the freet content is more than 140 characters long

## `DELETE /api/freets/:freetId?` - Delete an existing freet

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in
- `403` if the user is not the author of the freet
- `404` if the freetId is invalid

## `PATCH /api/freets/:freetId?` - Add a topic to an existing freet

**Body**

- `topic` *{string}* - The topic

**Returns**

- A success message
- The updated freet

**Throws**

- `403` if the user is not logged in
- `404` if the freetId is invalid
- `400` if the topic is not valid

## `POST /api/users/session` - Sign in user

**Body**

- `username` *{string}* - The user's username
- `password` *{string}* - The user's password

**Returns**

- A success message
- An object with user's details (without password)

**Throws**

- `403` if the user is already logged in
- `400` if username or password is not in correct format format or missing in the req
- `401` if the user login credentials are invalid

## `DELETE /api/users/session` - Sign out user

**Returns**

- A success message

**Throws**

- `403` if user is not logged in

## `POST /api/users` - Create an new user account

**Body**

- `username` *{string}* - The user's username
- `password` *{string}* - The user's password

**Returns**

- A success message
- An object with the created user's details (without password)

**Throws**

- `403` if there is a user already logged in
- `400` if username or password is in the wrong format
- `409` if username is already in use

## `PATCH /api/users` - Update a user's password

**Body**

- `password` *{string}* - The user's password

**Returns**

- A success message
- An object with the update user details (without password)

**Throws**

- `403` if the user is not logged in
- `400` if password is in the wrong format

## `POST /api/follows` - Follow a user

**Body**

- `username` *{string}* - The username of the user to be followed

**Returns**

- A success message
- An object with the created follow

**Throws**

- `403` if the user is not logged in
- `400` if username not included in request
- `404` if user with given username not found
- `403` if username is the logged in user
- `403` if logged in user already follows user with this username

## `DELETE /api/follows/:username?` - Unfollow a user

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in
- `400` if username not included in request
- `404` if user with given username not found

## `GET /api/follows?followerUsername=USERNAME&followeeUsername=USERNAME` - Check if one user follows another

**Returns**

- If the follow exists: the associated follow object
- If the follow does not exist: `204` with follow does not exist message

**Throws**

- `403` if the user is not logged in
- `404` if `followerUsername` or `followeeUsername` is not a recognized username of any user

## `GET /api/follows?followerUsername=USERNAME` - Get a user’s following

**Returns**

- An array of all follows created by user with username `followerUsername`

**Throws**

- `403` if the user is not logged in
- `404` if `followerUsername` is not a recognized username of any user

## `GET /api/follows?followeeUsername=USERNAME` - Get a user’s followers

**Returns**

- An array of all follows which have the logged in user as the followee

**Throws**

- `403` if the user is not logged in
- `404` if `followeeUsername` is not a recognized username of any user

## `POST /api/privatecircles` - Create a new Private Circle

**Body**

- `name` *{string}* - The name of the Private Circle

**Returns**

- A success message
- An object with the created Private Circle

**Throws**

- `403` if the user is not logged in
- `400` if name is incorrect format
- `409` if logged in user already has a Private Circle with name

## `GET /api/privatecircles` - Get logged in user’s Private Circles

**Returns**

- An array of Private Circles created by logged in user.

**Throws**

- `403` if the user is not logged in

## `GET /api/privatecircles/:privateCircle?` - Get specific Private Circle of logged in user

**Returns**

- The requested private circle

**Throws**

- `403` if the user is not logged in
- `404` If the logged in user doesn’t have a Private Circle with the given name

## `DELETE /api/privatecircles/:privateCircle?` - Delete an existing Private Circle

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in
- `404` If the logged in user doesn’t have a Private Circle with the given name

## `PATCH /api/privatecircles/:privateCircle?` - Toggle a user’s membership in an existing Private Circle of the logged in user

**Body**

- `username` *{string}* - The username of the user to be added

**Returns**

- A success message
- The updated Private Circle

**Throws**

- `403` if the user is not logged in
- `404` If the logged in user doesn’t have a Private Circle with the given name
- `404` if user with given username not found
- `403` if user to be added to Private Circle does not follow the logged in user

## `GET /api/anxietyshield` - Get Anxiety Shield of logged in user

**Returns**

- The requested Anxiety Shield

**Throws**

- `403` if the user is not logged in

## `PATCH /api/anxietyshield` - Add a topic to user’s Anxiety Shield

**Body**

- `topic` *{string}* - The topic

**Returns**

- A success message
- The updated Anxiety Shield

**Throws**

- `403` if the user is not logged in
- `400` if the topic is not valid