import React from "react";
import PropTypes from "prop-types";
import { IconChevronLeft } from "@edulastic/icons";
import { FlexContainer, MenuIcon } from "@edulastic/common";
import { white } from "@edulastic/colors";
import { Affix } from "antd";
import { Container, Title, Back, LeftSide, ReferenceText, ReferenceValue, RightSide, ExtraFlex } from "./styled";

const ItemHeader = ({ title, children, link, reference, toggleSideBar }) => {
  const renderLeftSide = () => (
    <LeftSide>
      <MenuIcon className="hamburger" onClick={() => toggleSideBar()} />
      <Title>{title}</Title>
      {reference && (
        <FlexContainer>
          <ReferenceText>Reference</ReferenceText>
          <ReferenceValue>{reference}</ReferenceValue>
        </FlexContainer>
      )}
    </LeftSide>
  );

  const renderIcon = () => {
    if (link) {
      return (
        <Back to={link.url}>
          <IconChevronLeft color={white} width={10} height={10} /> {link.text}
        </Back>
      );
    }
  };

  return (
    <Container type="standard">
      <Affix className="fixed-header" style={{ position: "fixed", top: 0, right: 0 }}>
        <ExtraFlex justifyContent="space-between" alignItems="center" style={{ flex: 1 }}>
          {renderLeftSide()}
          <RightSide>{children}</RightSide>
        </ExtraFlex>
        <LeftSide>{renderIcon()}</LeftSide>
      </Affix>
    </Container>
  );
};

ItemHeader.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
  link: PropTypes.any,
  toggleSideBar: PropTypes.func.isRequired,
  reference: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

ItemHeader.defaultProps = {
  children: null,
  title: "",
  link: null,
  reference: null
};

export default ItemHeader;
