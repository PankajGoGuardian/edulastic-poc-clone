import styled from 'styled-components';

const Main = styled.main`
  background-color: #f3f3f3;
  min-height: calc(100vh - 112px);
  color: #444444;

  & * {
    -webkit-user-select: none; /* Chrome all / Safari all */
    -moz-user-select: none; /* Firefox all */
    -ms-user-select: none; /* IE 10+ */
    user-select: none;
  }
`;

export default Main;
