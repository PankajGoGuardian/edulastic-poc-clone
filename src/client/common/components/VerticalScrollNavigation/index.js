import React from 'react'
import {
  Menu,
  StlyedListItem,
  StyledSectionLabel,
  StyledLabelContainer,
  StyledListPointer,
  StyledListPointerContainer,
  StyledList,
  ScrollbarContainer,
} from './styled-components'
import useVerticalScrollNavigation from './hooks/useVerticalScrollNavigation'

const VerticalScrollNavigation = ({
  sections,
  scrollContainer,
  headerHeight,
}) => {
  const { goToSection, activeTab } = useVerticalScrollNavigation({
    sections,
    scrollContainer,
    headerHeight,
  })

  return (
    <Menu>
      <ScrollbarContainer>
        <StyledList>
          {sections.map((section, index) => (
            <StlyedListItem
              key={index}
              onClick={(e) => goToSection(section, e)}
            >
              <StyledSectionLabel className="nav-section-label">
                <StyledListPointerContainer className="nav-list-item-pointer-container">
                  <StyledListPointer isActive={index === activeTab} />
                </StyledListPointerContainer>
                <StyledLabelContainer>{section.label}</StyledLabelContainer>
              </StyledSectionLabel>
            </StlyedListItem>
          ))}
        </StyledList>
      </ScrollbarContainer>
    </Menu>
  )
}

export default VerticalScrollNavigation
