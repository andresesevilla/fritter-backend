# Fritter Backend

Backend for Fritter assignment in MIT 6.1040.

## API routes

The following are the API routes implemented in the Fritter backend.

### `GET /`

This renders the `index.html` file that will be used to interact with the backend

### `GET /api/freets` - Get all the freets

**Returns**

- An array of all freets sorted in descending order by date modified
- All freets the logged in user does not have access to will be filtered out

**Throws**

- `403` if the user is not logged in

### `GET /api/freets?author=USERNAME` - Get freets by author

**Returns**

- An array of freets created by user with username `author`
- All freets the logged in user does not have access to will be filtered out

**Throws**

- `403` if the user is not logged in
- `400` if `author` is not given
- `404` if `author` is not a recognized username of any user

### `POST /api/freets` - Create a new freet

**Body**

- `content` *{string}* - The content of the freet

**Returns**

- A success message
- A object with the created freet

**Throws**

- `403` if the user is not logged in
- `400` If the freet content is empty or a stream of empty spaces
- `413` If the freet content is more than 140 characters long

### `DELETE /api/freets/:freetId?` - Delete an existing freet

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in
- `403` if the user is not the author of the freet
- `404` if the freetId is invalid

### `POST /api/users/session` - Sign in user

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

### `DELETE /api/users/session` - Sign out user

**Returns**

- A success message

**Throws**

- `403` if user is not logged in

### `POST /api/users` - Create an new user account

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

### `GET /api/users/:user/followers` - Get a user’s followers

**Returns**

- An object containing the users that follow user

**Throws**

- `403` if user is not logged in

### `GET /api/users/:user/following` - Get a user’s following

**Returns**

- An object containing the users that user follows

**Throws**

- `403` if user is not logged in

### `PUT /api/users/:user/following` - Follow or unfollow a user

**Body**

- `username` *{string}* - The user's username
- `follow` *{boolean}* - Whether following or unfollowing

**Returns**

- A success message

**Throws**

- `403` if user logged in is not user
- `400` if already following/not following user

### `GET /api/homepage` - Get homepage feed for logged in user

**Returns**

- An object containing the freets to be displayed on the homepage
- Will return a briefing instead if user has Briefing Mode enabled

**Throws**

- `403` if user not logged in
- `400` if already following/not following user

### `POST /api/users/:user/privatecircles` - Create a new private circle

**Body**

- `users` *{set}* - The users to be added to the Private Circle

**Throws**

- `403` if user is not logged in is not user

### `PUT /api/users/:user/privatecircles/:name` - Update a private circle

**Body**

- `users_add` *{set}* - The new set of users to be added to the Private Circle
- `users_remove` *{set}* - The new set of users to be removed from the Private Circle

**Throws**

- `403` if user is not logged in is not user

### `DELETE /api/users/:user/privatecircles/:name` - Delete a Private Circle

**Throws**

- `403` if user is not logged in is not user

### `POST /api/freets/:freetId/shield_reasons` - Report a post to Anxiety Shield

**Body**

- `reason` *{reason}* - the reason why this post was reported to Anxiety Shield

**Throws**

- `403` if the user is not logged in
- `404` if the freetId is invalid

### `GET /api/freets/:freetId/shield_reasons` - Get reasons why a post was reported to Anxiety Shield

**Throws**

- `403` if the user is not logged in
- `404` if the freetId is invalid

### `POST /api/users/:user/anxiety_shield` - Toggle whether Anxiety Shield is enabled for this user

**Throws**

- `403` if user is not logged in is not user

### `GET /:user/anxiety_shield` - Get whether Anxiety Shield is enabled for this user

**Returns**

- A boolean representing whether this user has Anxiety Shield enabled

**Throws**

- `403` if user is not logged in is not user

### `POST /api/users/:user/briefing_mode/size` - Set a user’s briefing size

**Body**

- `size` *{integer}* - the briefing size

**Throws**

- `403` if user is not logged in is not user

### `POST /api/users/:user/briefing_mode/period` - Set a user’s refresh period

**Body**

- `period` *{integer}* - the refresh period

**Throws**

- `403` if user is not logged in is not user

### `POST /api/users/:user/briefing_mode` - Toggle whether Briefing Mode is enabled for this user

**Throws**

- `403` if user is not logged in is not user

### `GET /api/users/:user/briefing_mode` - Get whether Briefing Mode is enabled for this user

**Returns**

- A boolean representing whether this user has Briefing Mode enabled

**Throws**

- `403` if user is not logged in is not user