import React from 'react'

/**
 * pass related props from assesment players to the question components
 * there are many components in between
 * so use this context intead of drilling props
 */
const assessmentPlayerContext = React.createContext({
  isStudentAttempt: false,
  currentItem: 0,
  setCurrentItem: () => {},
  firstItemInSectionAndRestrictNav: false, // To track the first item in the section and disable back navigation when preventSectionNavigation is enabled
})

export default assessmentPlayerContext
