const assessmentZoomMap = {
  xs: 1,
  sm: 1.3,
  md: 1.5,
  lg: 1.7,
  xl: 2,
}

const navZoomMap = {
  xs: 1,
  sm: 1.23,
  md: 1.4,
  lg: 1.6,
  xl: 1.8,
}

export const playersZoomTheme = (theme) => {
  return {
    ...theme,
    confirmationPopupButtonTextSize: `${theme.size3}px`,
    confirmationPopupTitleTextSize: `${theme.size1}px`,
    default: {
      ...theme.default,
      headerButtonFontSize: `${theme.size4}px`,
      headerButtonFontIconWidth: `${theme.size4}px`,
      headerButtonFontIconHeight: `${theme.size5}px`,
      headerExitButtonFontIconWidth: `${theme.size2 > 64 ? 64 : theme.size2}px`,
      headerExitButtonFontIconHeight: `${
        theme.size2 > 64 ? 64 : theme.size2
      }px`,
      headerToolbarButtonWidth: `${40 * assessmentZoomMap[theme?.zoomLevel]}px`,
      headerToolbarButtonHeight: `${
        40 * assessmentZoomMap[theme?.zoomLevel]
      }px`,
    },
    header: {
      ...theme.header,
      headerHeight: `${62 * assessmentZoomMap[theme?.zoomLevel]}px`,
      navZoom: navZoomMap[theme?.zoomLevel],
    },
    widgets: {
      ...theme.widgets,
      shading: {
        ...theme.widgets.shading,
        zoom: assessmentZoomMap[theme.zoomLevel],
      },
      highlightImage: {
        ...theme.widgets.highlightImage,
        imageZoom: assessmentZoomMap[theme.zoomLevel],
      },
      hotspot: {
        ...theme.widgets.hotspot,
        imageZoom: assessmentZoomMap[theme.zoomLevel],
      },
      classification: {
        ...theme.widgets.classification,
        imageZoom: assessmentZoomMap[theme.zoomLevel],
      },
      clozeImageDragDrop: {
        ...theme.widgets.clozeImageDragDrop,
        imageZoom: assessmentZoomMap[theme.zoomLevel],
      },
      clozeImageDropDown: {
        ...theme.widgets.clozeImageDropDown,
        imageZoom: assessmentZoomMap[theme.zoomLevel],
      },
      clozeImageText: {
        ...theme.widgets.clozeImageText,
        imageZoom: assessmentZoomMap[theme.zoomLevel],
      },
      clozeText: {
        ...theme.widgets.clozeText,
        textZoom: assessmentZoomMap[theme.zoomLevel],
      },
      chart: {
        ...theme.widgets.chart,
        chartZoom: assessmentZoomMap[theme.zoomLevel],
      },
      graphPlacement: {
        ...theme.widgets.graphPlacement,
        toolsZoom: assessmentZoomMap[theme.zoomLevel],
        dragDropTitleFontSize: `${theme.size4}px`,
      },
      assessmentPlayers: {
        ...theme.widgets.assessmentPlayers,
        textZoom: assessmentZoomMap[theme.zoomLevel],
      },
    },
  }
}
