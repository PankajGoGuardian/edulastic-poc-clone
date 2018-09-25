import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { green, greenDark, white, grey } from '../../utils/css';

const Pagination = ({ onPrevious, onNext, page, itemsPerPage, count }) => {
  // eslint-disable-next-line
  const isLastPage = Math.ceil(count / itemsPerPage) === page;

  return (
    <Container>
      {page === 1 ? (
        <Btn disabled>
          <FaChevronLeft style={{ marginRight: 10 }} /> Previous
        </Btn>
      ) : (
        <Btn onClick={onPrevious}>
          <FaChevronLeft style={{ marginRight: 10 }} /> Previous
        </Btn>
      )}

      <Info>
        {page} to {itemsPerPage} of {count}
      </Info>

      {isLastPage ? (
        <Btn disabled>
          Next <FaChevronRight style={{ marginLeft: 10 }} />
        </Btn>
      ) : (
        <Btn onClick={onNext}>
          Next <FaChevronRight style={{ marginLeft: 10 }} />
        </Btn>
      )}
    </Container>
  );
};

Pagination.propTypes = {
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
};

export default Pagination;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  padding: 20px 50px;
  background: ${white};
`;

const Btn = styled.span`
  color: ${({ disabled }) => (disabled ? grey : greenDark)};
  display: flex;
  align-items: center;

  :hover {
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    color: ${({ disabled }) => (disabled ? grey : green)};
  }
`;

const Info = styled.span`
  color: #434b5d;
  font-size: 13px;
`;
