const assessmentZoomMap = {
  xs: 1,
  sm: 1.3,
  md: 1.5,
  lg: 1.7,
  xl: 2
};

export const playersZoomTheme = theme => {
  return {
    ...theme,
    confirmationPopupButtonTextSize: `${theme.size3}px`,
    confirmationPopupTitleTextSize: `${theme.size1}px`,
    default: {
      ...theme.default,
      headerButtonFontSize: `${theme.size4}px`,
      headerButtonFontIconWidth: `${theme.size4}px`,
      headerButtonFontIconHeight: `${theme.size5}px`
    },
    widgets: {
      ...theme.widgets,
      shading: {
        ...theme.widgets.shading,
        zoom: assessmentZoomMap[theme.zoomLevel]
      },
      highlightImage: {
        ...theme.widgets.highlightImage,
        imageZoom: assessmentZoomMap[theme.zoomLevel]
      },
      hotspot: {
        ...theme.widgets.hotspot,
        imageZoom: assessmentZoomMap[theme.zoomLevel]
      },
      classification: {
        ...theme.widgets.classification,
        imageZoom: assessmentZoomMap[theme.zoomLevel]
      },
      clozeImageDragDrop: {
        ...theme.widgets.clozeImageDragDrop,
        imageZoom: assessmentZoomMap[theme.zoomLevel]
      },
      clozeImageDropDown: {
        ...theme.widgets.clozeImageDropDown,
        imageZoom: assessmentZoomMap[theme.zoomLevel]
      },
      clozeImageText: {
        ...theme.widgets.clozeImageText,
        imageZoom: assessmentZoomMap[theme.zoomLevel]
      },
      clozeText: {
        ...theme.widgets.clozeText,
        textZoom: assessmentZoomMap[theme.zoomLevel]
      },
      chart: {
        ...theme.widgets.chart,
        chartZoom: assessmentZoomMap[theme.zoomLevel]
      }
    }
  };
};
