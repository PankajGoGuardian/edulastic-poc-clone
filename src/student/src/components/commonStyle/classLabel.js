import styled from 'styled-components';

const ClassLabel = styled.span`
  line-height: 2.5rem;
  text-align: center;
  width: 36%;
  color: rgb(67, 75, 93);
  font-weight: 600;
  font-size: 0.9rem;
  background-color: rgb(229, 229, 229);
  @media (max-width: 900px) {
    line-height: 3rem;
    width: 40%;
  }
  @media (max-width: 768px) {
    width: 50%;
  }
`;

export default ClassLabel;
