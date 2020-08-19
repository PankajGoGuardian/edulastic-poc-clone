import React from "react";
import styled from "styled-components";
import { EduButton } from "@edulastic/common";
import PropTypes from "prop-types";

const PrintActionWrapper = ({
  isBlue,
  className,
  children,
  onClick,
  isFixed,
  ...restProps
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else{
      window.print();
    }
  }

  return (
    <StyledPrintActionWrapper className={className} isFixed={isFixed}>
      {
        <EduButton isBlue={isBlue} {...restProps} onClick={handleClick}>{children || 'Print'}</EduButton>
      }
    </StyledPrintActionWrapper>
  )
};

PrintActionWrapper.propTypes = {
  className: PropTypes.string,
  isBlue: PropTypes.bool,
  isGhost: PropTypes.bool,
  onClick: PropTypes.func,
  isFixed: PropTypes.bool
};

PrintActionWrapper.defaultProps = {
  isBlue: true,
  isGhost: false,
  className: "print-action-wrapper",
  'data-cy': "print",
  isFixed: true
};

const StyledPrintActionWrapper = styled.div`
  position: ${({isFixed}) => isFixed && "fixed"};
  width: 100%;
  display: flex;
  justify-content: flex-end;
  top: 20px;
  right: 20px;
`;

export default PrintActionWrapper;