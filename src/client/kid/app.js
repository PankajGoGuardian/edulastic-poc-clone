import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
import { EduButton } from '@edulastic/common'
import {
  getFromSessionStorage,
  getFromLocalStorage,
} from '@edulastic/api/src/utils/Storage'
import { StyledH3 } from '../author/Reports/common/styled'
import { ConfirmationModal as KidModal } from '../author/src/components/common/ConfirmationModal'
import { fetchUserAction } from '../student/Login/ducks'

const Kid = ({ location, fetchUser }) => {
  const [textCopied, setTextCopied] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  useEffect(() => fetchUser, [])

  // tokenKey is stored in the form => user:<user_id>:role:<role>
  let items =
    getFromSessionStorage('tokenKey') || getFromLocalStorage('defaultTokenKey')
  items = items ? items.split(':') : []

  // set data to be displayed
  const displayData = {
    tid: getFromSessionStorage('tid') || '',
    kid: getFromSessionStorage('kid') || '',
    user: items.length > 0 && items[0] === 'user' ? items[1] : '',
    role: items.length > 2 && items[2] === 'role' ? items[3] : '',
    host: window.location.host,
    dateTime: new Date().toString(),
  }

  const onCancelHandler = () => {
    setCancelled(true)
  }

  const copyToClipboard = (containerId) => {
    if (document.selection) {
      const range = document.body.createTextRange()
      range.moveToElementText(document.getElementById(containerId))
      range.select().createTextRange()
      document.execCommand('copy')
      document.selection.empty()
    } else if (window.getSelection) {
      const range = document.createRange()
      range.selectNode(document.getElementById(containerId))
      window.getSelection().addRange(range)
      document.execCommand('copy')
      window.getSelection().removeAllRanges()
      setTextCopied(true)
    }
  }

  const footer = [
    <EduButton onClick={() => copyToClipboard('debugData')}> Copy </EduButton>,
    textCopied && <StyledAlert> Copied! </StyledAlert>,
  ]

  return cancelled ? (
    <Redirect to={{ pathname: '/', state: { from: location } }} />
  ) : (
    <KidModal
      textAlign="left"
      width="700px"
      modalWidth="250px"
      visible
      footer={footer}
      onCancel={onCancelHandler}
    >
      <p id="debugData">
        <b>
          <pre>
            {[
              `{`,
              `  tid:\t"${displayData.tid}",`,
              `  kid:\t"${displayData.kid}",`,
              `  user:\t"${displayData.user}",`,
              `  role:\t"${displayData.role}",`,
              `  host:\t"${displayData.host}",`,
              `  date:\t"${displayData.dateTime}"`,
              `}`,
            ].join('\n')}
          </pre>
        </b>
      </p>
    </KidModal>
  )
}

export default connect(() => {}, { fetchUser: fetchUserAction })(Kid)

const StyledAlert = styled(StyledH3)`
  margin: 9px 20px 0px 20px;
`
