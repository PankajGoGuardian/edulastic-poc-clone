import { notification } from '@edulastic/common'
import React, { useState } from 'react'
import connect from 'react-redux/es/connect/connect'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { GooglePicker } from '../../../../../../vendors/google'
import { getUserFeatures } from '../../../../src/selectors/user'
import {
  getImportGoogleFormTestSelector,
  importGoogleFormTestAction,
} from '../ducks'
import ImportGoogleFormModal from '../components/ImportGoogleFormModal'
import { DEFAULT_TEST_TITLE } from '../../../../TestPage/utils'
import { stopPropagation } from '../../CreationOptions/utils'

const GoogleFormQuiz = ({
  children,
  history,
  userFeatures,
  importGoogleFormTest,
  importGoogleFormState,
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [formName, setFormName] = useState('')

  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }

  const onAuthFailed = (message) => {
    console.error('Google Authentication Failed', message)
    return notification({ type: 'warn', messageKey: 'authenticationFailed' })
  }

  const onSelect = ({ action, docs, token }) => {
    const selectedDoc = docs?.[0]
    if (action === 'picked' && selectedDoc?.id && token) {
      setFormName(selectedDoc?.name || DEFAULT_TEST_TITLE)
      importGoogleFormTest({
        formId: selectedDoc.id,
        oAuthToken: token,
      })
      toggleModal()
    }
  }

  const onCreate = (e) => {
    if (!userFeatures?.premium) {
      stopPropagation(e)
      return history.push('/author/subscription')
    }
  }

  const { apiStatus, result, errorMessage } = importGoogleFormState

  return (
    <>
      <ImportGoogleFormModal
        status={apiStatus}
        data={result}
        errorMessage={errorMessage}
        formName={formName}
        visible={modalVisible}
        onCancel={toggleModal}
      />
      <GooglePicker
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        onChange={onSelect}
        onAuthFailed={onAuthFailed}
        mimeTypes={['application/vnd.google-apps.form']}
      >
        <span onClick={onCreate}>{children}</span>
      </GooglePicker>
    </>
  )
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      importGoogleFormState: getImportGoogleFormTestSelector(state),
      userFeatures: getUserFeatures(state),
    }),
    {
      importGoogleFormTest: importGoogleFormTestAction,
    }
  )
)

export default enhance(GoogleFormQuiz)
