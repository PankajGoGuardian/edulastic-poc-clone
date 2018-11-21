# Edulastic POC

This is the mono-repo holding front-end repos and packages together. The project requires node ( 8+), yarn (1.9+).

### How to Run

**Dev Mode**

- `yarn .` install all the packages required by front-end repos/packages.
- `yarn start` to start the react client and Express server
- `API_URI='/api/' yarn start` run using local API

**Production Mode**

- `yarn build`
- `yarn start-build`

### Routes

- `/student/test` - Assessment Player with skin 1
- `/student/practice` - Assesment player with skin 2
- `/author/items` - entry point for author: list's testItems
