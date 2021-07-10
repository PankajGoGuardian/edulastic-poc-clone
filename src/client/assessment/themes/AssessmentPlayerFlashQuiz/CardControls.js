import { FlexContainer } from '@edulastic/common'
import { IconArrowLeft, IconArrowRight } from '@edulastic/icons'
import React from 'react'
import { Button, PaginationText } from './styled'

const CardControls = ({
  disablePrev,
  disableNext,
  handleNext,
  handlePrev,
  cardNo = 0,
  totalCards = 0,
}) => (
  <FlexContainer
    width="620px"
    justifyContent="space-between"
    alignItems="center"
    marginLeft="auto"
    mr="auto"
  >
    <Button hide={disablePrev} onClick={handlePrev}>
      <IconArrowLeft />
    </Button>
    <PaginationText>
      {cardNo} / {totalCards}
    </PaginationText>
    <Button hide={disableNext} onClick={handleNext}>
      <IconArrowRight />
    </Button>
  </FlexContainer>
)

export default CardControls
