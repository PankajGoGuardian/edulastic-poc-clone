import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { withNamespaces } from "@edulastic/localization";

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
    style={style}
    isDragActive={isDragActive}
    childMarginRight={0}
    justifyContent="center"
    flexDirection="column"
  >
    {loading ? (
      <Loading type="loading" />
    ) : (
      thumb || (
        <Fragment>
          <IconUpload isDragActive={isDragActive} />
          <ZoneTitle>{t("component.dropZone.dragDrop")}</ZoneTitle>
          <ZoneTitle altColor>{t(`component.dropZone.yourOwn${name}`)}</ZoneTitle>
          <ZoneTitle isComment>
            {t("component.dropZone.or")} <Underlined>{t("component.dropZone.browse")}</Underlined>: {allowedFiles} (
            {maxSize}KB MAX.)
          </ZoneTitle>
          {children}
        </Fragment>
      )
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
