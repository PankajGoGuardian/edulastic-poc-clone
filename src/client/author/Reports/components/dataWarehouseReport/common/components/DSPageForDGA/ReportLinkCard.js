import { Col, Row, Tooltip } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import { CUSTOM_REPORTS_URL } from '../../../../../common/constants/dataWarehouseReports'
import {
  CardMainContent,
  ReportCardFooter,
  ReportCardTitle,
  StyledReportCard,
  TextContainer,
} from '../StyledComponents'

const ReportLinkCardForDGA = ({
  IconThumbnail,
  title,
  description,
  url,
  hasCustomReportAccess,
  styles = {},
  loc,
}) => {
  const tooltipText =
    url === CUSTOM_REPORTS_URL && !hasCustomReportAccess
      ? 'Custom reports are not accessible.'
      : ''
  const isLinkClickable = hasCustomReportAccess || url !== CUSTOM_REPORTS_URL

  return (
    <Col span={styles.span} offset={styles.offset}>
      <StyledReportCard data-cy={`dataStudio-card-${title}`}>
        <CardMainContent>
          <Row justify="space-between" type="flex">
            <Col span={11}>
              <ReportCardTitle>{title}</ReportCardTitle>
              <TextContainer $height={styles.height}>
                <p>{description}</p>
              </TextContainer>
            </Col>
            <div>
              <IconThumbnail />
            </div>
          </Row>
        </CardMainContent>
        <ReportCardFooter $isClickable={isLinkClickable}>
          <EduIf condition={!url}>
            <EduThen>
              <div>View Now</div>
            </EduThen>
            <EduElse>
              <Tooltip title={tooltipText}>
                <div>
                  <Link to={{ pathname: url, state: { source: loc } }}>
                    View Now
                  </Link>
                </div>
              </Tooltip>
            </EduElse>
          </EduIf>
        </ReportCardFooter>
      </StyledReportCard>
    </Col>
  )
}

export default ReportLinkCardForDGA
