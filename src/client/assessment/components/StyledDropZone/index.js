import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { withNamespaces } from '@edulastic/localization'
import { FlexContainer } from '@edulastic/common'

import { Container, ZoneTitle, Underlined, Loading, IconUpload } from './styled'

const StyledDropZone = ({
  loading,
  isDragActive,
  t,
  dropzoneSettings: { name, allowedFiles, maxSize },
  children,
}) => (
  <Container
    alignItems="center"
    justifyContent="center"
    isDragActive={isDragActive}
    flexDirection="column"
  >
    {loading ? (
      <FlexContainer
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Loading type="loading" />
      </FlexContainer>
    ) : (
      <>
        <FlexContainer
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <IconUpload isDragActive={isDragActive} />
          <ZoneTitle>{t('component.dropZone.dragDrop')}</ZoneTitle>
          {name && (
            <ZoneTitle>{t(`component.dropZone.yourOwn${name}`)}</ZoneTitle>
          )}
          <ZoneTitle isComment>
            {t('component.dropZone.or')}{' '}
            <Underlined>{t('component.dropZone.browse')}</Underlined>:{' '}
            {allowedFiles} {maxSize ? `(${maxSize}KB MAX.)` : ''}
          </ZoneTitle>
        </FlexContainer>
        {children}
      </>
    )}
  </Container>
)

StyledDropZone.propTypes = {
  loading: PropTypes.bool.isRequired,
  isDragActive: PropTypes.any,
  t: PropTypes.func.isRequired,
  dropzoneSettings: PropTypes.object,
}

StyledDropZone.defaultProps = {
  isDragActive: false,
  dropzoneSettings: {
    name: 'Image',
    allowedFiles: 'PNG, JPG, GIF',
    maxSize: 1024,
  },
}

export default withNamespaces('assessment')(StyledDropZone)
