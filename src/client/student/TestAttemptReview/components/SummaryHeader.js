import React from 'react'
import { Tooltip } from 'antd'
import { themeColor } from '@edulastic/colors'
import { IconCircleLogout, IconLogoCompact } from '@edulastic/icons'
import styled from 'styled-components'
import { SaveAndExitButton } from '../../../assessment/themes/common/styledCompoenents'

const SummaryHeader = ({
  hidePause,
  onExitClick,
  showExit,
  isTestPreviewModal = false,
}) => {
  const exitTestText = isTestPreviewModal ? 'Exit' : 'Save & Exit'
  return (
    <Header>
      <IconLogoCompact style={{ fill: themeColor, marginLeft: '21px' }} />
      {showExit && (
        <Tooltip
          placement="bottom"
          title={
            hidePause
              ? 'This assignment is configured to completed in a single sitting'
              : exitTestText
          }
        >
          <SaveAndExitButton
            data-cy="finishTest"
            aria-label="Save and exit"
            onClick={onExitClick}
            style={{ border: '1px solid', marginRight: '30px' }}
            disabled={hidePause}
          >
            <IconCircleLogout />
          </SaveAndExitButton>
        </Tooltip>
      )}
    </Header>
  )
}

export default SummaryHeader

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 53px;
  border: 1px solid #dadae4;
  opacity: 1;
`
