import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Pagination } from 'antd';
import { lightBlue } from '@edulastic/colors';

const PassageView = ({ item }) => {
  const [page, setPage] = useState(1);

  return (
    <div>
      {item.instructor_stimulus && (
        <InstructorStimulus dangerouslySetInnerHTML={{ __html: item.instructor_stimulus }} />
      )}
      <Heading>{item.heading}</Heading>
      {!item.paginated_content && item.content && (
        <div dangerouslySetInnerHTML={{ __html: item.content }} />
      )}
      {item.paginated_content && item.pages && !!item.pages.length && (
        <div>
          <div dangerouslySetInnerHTML={{ __html: item.pages[page - 1] }} />
          <Pagination
            pageSize={1}
            simple
            hideOnSinglePage
            onChange={setPage}
            current={page}
            total={item.pages.length}
          />
        </div>
      )}
    </div>
  );
};

PassageView.propTypes = {
  item: PropTypes.object.isRequired
};

export default PassageView;

const Heading = styled.div`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 15px;
`;

const InstructorStimulus = styled.div`
  background: ${lightBlue};
  padding: 10px;
  border-radius: 10px;
`;
