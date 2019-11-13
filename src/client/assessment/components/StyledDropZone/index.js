import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";
import { FlexContainer } from "@edulastic/common";

import { Container } from "./styled/Container";
import { ZoneTitle } from "./styled/ZoneTitle";
import { Underlined } from "./styled/Underlined";
import { Loading } from "./styled/Loading";
import { IconUpload } from "./styled/IconUpload";

const StyledDropZone = ({
  thumb,
  loading,
  isDragActive,
  t,
  style,
  dropzoneSettings: { name, allowedFiles, maxSize },
  children
}) => (
  <Container
    alignItems="flex-start"
    style={style}
    justifyContent="flex-start"
    isDragActive={isDragActive}
    childMarginRight={0}
    flexDirection="column"
  >
    {loading ? (
      <div
        style={{
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%"
        }}
      >
        <Loading type="loading" />
      </div>
    ) : (
      <Fragment>
        <FlexContainer
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          style={{ height: "100%", width: "100%" }}
        >
          <IconUpload isDragActive={isDragActive} />
          <ZoneTitle>{t("component.dropZone.dragDrop")}</ZoneTitle>
          <ZoneTitle altColor>{t(`component.dropZone.yourOwn${name}`)}</ZoneTitle>
          <ZoneTitle isComment>
            {t("component.dropZone.or")} <Underlined>{t("component.dropZone.browse")}</Underlined>: {allowedFiles} (
            {maxSize}KB MAX.)
          </ZoneTitle>
        </FlexContainer>
        {children}
      </Fragment>
    )}
  </Container>
);

StyledDropZone.propTypes = {
  thumb: PropTypes.any,
  loading: PropTypes.bool.isRequired,
  isDragActive: PropTypes.any,
  t: PropTypes.func.isRequired,
  dropzoneSettings: PropTypes.object
};

StyledDropZone.defaultProps = {
  thumb: null,
  isDragActive: false,
  dropzoneSettings: { name: "Image", allowedFiles: "PNG, JPG, GIF", maxSize: 1024 }
};

export default withNamespaces("assessment")(StyledDropZone);
