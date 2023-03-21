import React from 'react'
import { launchAsync } from '@microsoft/immersive-reader-sdk'
import { fetchIRtokenAndSubDomain } from '@edulastic/api'
import { isUndefined } from 'lodash'
import IconImmersiveReader from '@edulastic/icons/src/IconImmersiveReader'

import { Tooltip } from 'antd'
import { notification, captureSentryException } from '@edulastic/common'
import { compose } from 'redux'
import { withNamespaces } from '@edulastic/localization'
import { StyledButton } from '../../../../../src/client/assessment/themes/common/styledCompoenents'

const ImmersiveReader = ({ t: i18translate, title }) => {
  const getImmersiveReaderArgs = async () => {
    try {
      const { token, subdomain } = await fetchIRtokenAndSubDomain()

      const chunks = []
      // eslint-disable-next-line func-names
      $('.immersive-reader-content').each(function () {
        chunks.push({
          content: $(this).html(),
          mimeType: 'text/html',
        })
      })

      const content = {
        title,
        chunks,
      }

      const options = {
        uiZIndex: 2000,
      }

      return [token, subdomain, content, options]
    } catch (error) {
      notification({
        messageKey: 'immersiveReaderFailedApiError',
      })
      captureSentryException(error, {
        errorMessage:
          'ImmersiveReader - failed to get Immersive reader token and sub-domain',
      })
    }
  }

  const handleLaunchImmersiveReader = async () => {
    try {
      const immersiveReaderArgs = await getImmersiveReaderArgs()
      if (!isUndefined(immersiveReaderArgs))
        await launchAsync(...immersiveReaderArgs)
    } catch (error) {
      notification({
        messageKey: 'immersiveReaderLaunchError',
      })
      captureSentryException(error, {
        errorMessage: 'ImmersiveReader - failed to launch Immersive reader',
      })
    }
  }

  return (
    <Tooltip
      placement="bottom"
      title={i18translate('assessmentPlayer.immersiveReaderToolTip')}
    >
      <StyledButton
        data-cy="immersiveReader"
        onClick={() => handleLaunchImmersiveReader()}
      >
        <IconImmersiveReader />
      </StyledButton>
    </Tooltip>
  )
}

const enhance = compose(withNamespaces('common'))
export default enhance(ImmersiveReader)
