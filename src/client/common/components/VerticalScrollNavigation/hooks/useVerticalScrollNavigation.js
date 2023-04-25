import { useState, useEffect } from 'react'
import { throttle, isUndefined } from 'lodash'

const useVerticalScrollNavigation = ({
  scrollContainer,
  sections,
  headerHeight,
}) => {
  const [activeTab, setActiveTab] = useState(0)

  const scrollTop = () => {
    if (isUndefined(scrollContainer?.scrollTop)) {
      return window.scrollY
    }
    return scrollContainer.scrollTop
  }

  const scrollHeight = () => {
    if (isUndefined(scrollContainer?.scrollHeight)) {
      return document.body.scrollHeight
    }
    return scrollContainer.scrollHeight
  }

  const clientHeight = () => {
    if (isUndefined(scrollContainer?.clientHeight)) {
      return window.innerHeight
    }
    return scrollContainer.clientHeight
  }

  const findActiveTab = () => {
    const scrollContainerScrollTop = scrollTop()
    for (let i = 0; i < sections.length; i++) {
      const element = sections[i].element
      if (
        sections.length > activeTab &&
        scrollContainerScrollTop >= element.offsetTop &&
        scrollContainerScrollTop < element.offsetTop + element.scrollHeight
      ) {
        setActiveTab(i + 1)
      }
      if (
        sections[0] &&
        scrollContainerScrollTop < sections[0].element.scrollHeight / 2
      ) {
        setActiveTab(0)
      } else if (
        sections.length > activeTab &&
        scrollHeight() <= scrollContainerScrollTop + clientHeight()
      ) {
        setActiveTab(sections.length - 1)
      }
    }
  }

  const onScroll = throttle(findActiveTab, 200)

  const goToSection = (section) => {
    scrollContainer.removeEventListener('scroll', onScroll)
    const activeSectionIndex = sections.findIndex(
      (_section) => _section.label === section.label
    )
    const node = section.element
    scrollContainer.scroll({
      left: 0,
      top: node.offsetTop - headerHeight,
      behavior: 'smooth',
    })

    setTimeout(() => {
      setActiveTab(activeSectionIndex)
      scrollContainer.addEventListener('scroll', onScroll)
    }, 200)
  }

  useEffect(() => {
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', onScroll)
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', onScroll)
      }
    }
  }, [scrollContainer])

  return { goToSection, activeTab }
}

export default useVerticalScrollNavigation
