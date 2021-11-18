import { EduButton } from '@edulastic/common'
import { IconUpload } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import PropTypes from 'prop-types'
import React from 'react'
import { withRouter } from 'react-router'
import CardComponent from '../../../AssignmentCreate/common/CardComponent'
import IconWrapper from '../../../AssignmentCreate/common/IconWrapper'
import TextWrapper from '../../../AssignmentCreate/common/TextWrapper'
import TitleWrapper from '../../../AssignmentCreate/common/TitleWrapper'

const OptionQti = ({ t, history: { push } }) => {
  //   const customRequest = ({ file, onSuccess }) => {
  //     // Can check each file for server side validation or response
  //     setTimeout(() => {
  //       onSuccess("ok"); // fake response
  //     }, 0);
  //   };

  //   const onChange = ({ file, fileList }) => {
  //     // replace upload action for qti (hangdle multiple files)
  //     // write action to upload multiple files (fileList)
  //     if (fileList.every(({ status }) => status === "done")) {
  //       // make an action call here
  //       console.log("all done");
  //     }
  //   };

  //   const beforeUpload = (file, fileList) => {
  //     // file validation for size and type should be done here
  //     console.log("before upload", { fileList });
  //   };

  //   const props = {
  //     name: "file",
  //     customRequest,
  //     accept: ".pdf",
  //     onChange,
  //     multiple: true,
  //     beforeUpload,
  //     showUploadList: false
  //   };

  const changeRoute = () => {
    push('/author/import-test')
  }

  return (
    <CardComponent>
      <IconWrapper>
        <IconUpload style={{ height: '43px', width: '34px' }} />
      </IconWrapper>
      <TitleWrapper>{t('qtiimport.card.title')}</TitleWrapper>
      <TextWrapper> {t('qtiimport.card.desctription')} </TextWrapper>
      <EduButton isGhost width="234px" onClick={changeRoute}>
        <span>{t('qtiimport.card.buttontext')}</span>
      </EduButton>
    </CardComponent>
  )
}

OptionQti.propTypes = {
  t: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}

OptionQti.defaultPropTypes = {
  t: () => {},
}

export default withNamespaces('qtiimport')(withRouter(OptionQti))
