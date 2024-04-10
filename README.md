# Backend challenge: Tasks

This file documents the proposed solution for the [Every.io BE challenge](https://github.com/every-io/engineering-interivew-be)

# Configuration

Run the `npm install` command to install dependencies. On Linux it works out of the box, on MacOS I had to use Node.js 18 and run the `npm config set python "$(which python3)"` command first before I was able to compile the sqlite dependency. In order to install that Node.js version the command `nvm install` can be used at the root of the repo, provided you are using `nvm` to manage Node.js versions.

# Running the API in dev mode

The API is started with the `npm run start:dev` which will reload the API when sources are updated.

# Building the API

The API can be built with the `npm run build` command, which will generate the target javascript files.

# Starting the API

After build, the API can be started with the `npm start` command.

# Using docker

The API can be built as a container using the docker command as follows to build the `tasks:latest` tag:

```
docker run tasks:latest
```

Once the image is built, a container can be run using this command to expose the API on port 3000:

```
docker run --rm --publish 3000:3000 tasks:latest
```

# Running tests

Tests are ran with the `npm run test` command. For now only E2E are implemented, using the same in-memory sqlite DB than when running the API.

# API documentation

The following endpoints are available:

## **POST** `/users`

Allows to create a user, request is as follows:

```
curl --location 'localhost:3000/users' \
--header 'Content-Type: application/json' \
--data '{
    "username": "user"
}'
```

It returns the newly created user, like this

```
{
    "id": 1,
    "username": "user",
    "updatedAt": "2024-04-10T20:02:23.066Z",
    "createdAt": "2024-04-10T20:02:23.066Z"
}
```

## **POST** `/tasks`

Allows to create a task, request is as follows:

```
curl --location 'localhost:3000/tasks' \
--header 'x-user-id: 1' \
--header 'Content-Type: application/json' \
--data '{
    "title": "title",
    "description": "description"
}'
```

Notice that the header `x-user-id` must be set with the user id. It returns the newly created task, like this

```
{
    "state": "todo",
    "id": 1,
    "title": "title",
    "description": "description",
    "userId": 1,
    "updatedAt": "2024-04-10T19:54:45.492Z",
    "createdAt": "2024-04-10T19:54:45.492Z"
}
```

## **PUT** `/tasks/:id`

Allows to update a task, request is as follows:

```
curl --location --request PUT 'localhost:3000/tasks/1' \
--header 'x-user-id: 1' \
--header 'Content-Type: application/json' \
--data '{
    "state": "inProgress"
}'
```

Again, the `x-user-id` must be set with the user id. Possible values for `state` are the following: `["todo", "inProgress", "done"]`. It returns the updated task, like this

```
{
    "state": "inProgress",
    "id": 1,
    "title": "title",
    "description": "description",
    "userId": 1,
    "updatedAt": "2024-04-10T19:54:45.492Z",
    "createdAt": "2024-04-10T19:54:45.492Z"
}
```

## **POST** `/tasks/:id/archive`

Allows to archive a task, request is as follows:

```
curl --location --request POST 'localhost:3000/tasks/2/archive' \
--header 'x-user-id: 2'
```

Again, the `x-user-id` must be set with the user id. The task should not be already on `archived` state. It returns the updated task, like this

```
{
    "state": "archived",
    "id": 1,
    "title": "title",
    "description": "description",
    "userId": 1,
    "updatedAt": "2024-04-10T19:54:45.492Z",
    "createdAt": "2024-04-10T19:54:45.492Z"
}
```

## **GET** `/tasks`

Returns the list of tasks for the user, request is as follows:

```
curl --location 'localhost:3000/tasks?includeArchived=true' \
--header 'x-user-id: 1'
```

Again, the `x-user-id` must be set with the user id. Archived tasks are not returned by default, this can be overriden with the `includeArchived=true` query param. It returns the list of tasks, like this

```
[
    {
        "state": "todo",
        "id": 1,
        "title": "title",
        "description": "description",
        "userId": 1,
        "updatedAt": "2024-04-10T19:54:45.492Z",
        "createdAt": "2024-04-10T19:54:45.492Z"
    }
]
```

# Further improvements:

Here's a list of things that are left pending for future improvements to the API:

- Add unit tests, currently only E2E are implemented using the API endpoints.
- Use a library for dependency injection.
- Use the repository pattern to talk with the DB.
- Use a real DB like MySQL or PostgreSQL.
- Implement a proper authentication mechanism using something like JWT as bearer tokens.
- Add proper API documentation, using swagger or similar.
- Use a library to simplify the declaration of routes and validated parts of the request.
- Add some kind of logging library, particularly something that'd allow to connect with services to handle logs
