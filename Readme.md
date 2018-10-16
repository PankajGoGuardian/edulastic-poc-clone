# Edulastic POC

This is the mono-repo holding front-end repos and packages together. The project requires node ( 8+), yarn (1.9+) and mongodb (for running the temporary test backend server)

### How to Run

- `yarn .` install all the packages required by front-end repos/packages.
- start the test server\*
- `yarn start` to start the react client

### Running test server

This is a temporary server till the project migrate to use the loopback-api server. Its located in the `test-server` folder.

- Restore mongodb with data in `mongodump` folder.
- configure db details in `config/default.json`
- `npm i` to install all required packages
- run the server with `npm run dev`

### Routes

- `/student/test` - Assessment Player with skin 1
- `/student/practice` - Assesment player with skin 2
- `/author/items` - entry point for author: list's testItems
