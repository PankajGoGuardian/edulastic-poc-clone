import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { IconChevronLeft, IconPencilEdit } from "@edulastic/icons";
import { FlexContainer, TextField, MenuIcon } from "@edulastic/common";
import { greenDark, white } from "@edulastic/colors";
import { Affix } from "antd";
import { Container, Title, RightSide, LeftSide, Back, ExtraFlex, TitleNav } from "./styled";
import { toggleSideBarAction } from "../../../src/actions/toggleMenu";

const ItemHeader = ({ title, children, link, reference, editReference, onChange, hideIcon, toggleSideBar }) => (
  <Container type="standard">
    <Affix className="fixed-header" style={{ position: "fixed", top: 0, right: 0 }}>
      <ExtraFlex justifyContent="space-between" alignItems="center" style={{ flex: 1 }}>
        <LeftSide>
          <MenuIcon className="hamburger" onClick={() => toggleSideBar()} />
          <TitleNav>
            <Title>{title}</Title>
          </TitleNav>
          {reference && (
            <FlexContainer>
              <span style={{ color: white }}>Reference</span>
              <TextField
                icon={!hideIcon && <IconPencilEdit color={greenDark} width={16} height={16} />}
                type="text"
                height="40px"
                value={reference}
                onChange={onChange}
                onBlur={editReference}
                style={{ background: "#f3f3f3", marginLeft: 10, width: 290 }}
              />
            </FlexContainer>
          )}
        </LeftSide>
        <RightSide>{children}</RightSide>
      </ExtraFlex>
      <LeftSide>
        {link && (
          <Back to={link.url}>
            <IconChevronLeft color={white} width={10} height={10} /> {link.text}
          </Back>
        )}
      </LeftSide>
    </Affix>
  </Container>
);

ItemHeader.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
  link: PropTypes.any,
  reference: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  editReference: PropTypes.func,
  onChange: PropTypes.func,
  hideIcon: PropTypes.bool,
  toggleSideBar: PropTypes.func.isRequired
};

ItemHeader.defaultProps = {
  children: null,
  title: "",
  link: null,
  reference: null,
  editReference: () => {},
  onChange: () => {},
  hideIcon: false
};

export default connect(
  null,
  { toggleSideBar: toggleSideBarAction }
)(ItemHeader);
