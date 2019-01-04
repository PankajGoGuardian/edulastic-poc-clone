# Structure 📚

At the root level, project will have 3 parts:

- **student**: contains the student part of the app
- **author**: cotains the teacher/author part of the app
- **assesment**: contains assessment player, questions and other components related to rendering the forementioned.

Each above mentioned part will have a project structure as described below:

- **actions**: redux action
- **assets**: images and other static assets
- **components**: hold the react components. This is further divided into
  - **components**: presentation/dumb components
  - **containers**: container/smart componens
  - **screens**: route level components, to wrap other components for a particular route together
  - **styled**: all the cool styled components
- **reducers**: redux store reduxers
- **sagas**: redux sagas
- **selectors**: redux selectors

The idea is to follow presentational/container component pattern while developing react component. For reference read [this link](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)
