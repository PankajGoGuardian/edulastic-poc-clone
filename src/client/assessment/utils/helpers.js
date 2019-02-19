export const getFontSize = (fontSize) => {
  switch (fontSize) {
    case 'small':
      return '12px';
    case 'normal':
      return '14px';
    case 'large':
      return '16px';
    case 'xlarge':
      return '18px';
    case 'xxlarge':
      return '20px';
    default:
      return '14px';
  }
};

export const topAndLeftRatio = (styleNumber, imagescale, fontsize, smallSize) => {
  const getValueWithRatio = newRatio => (smallSize ? styleNumber / 2 : styleNumber * newRatio);

  if (!imagescale) {
    return getValueWithRatio(1);
  }

  switch (fontsize) {
    case 'large':
      return getValueWithRatio(1.2);
    case 'xlarge':
      return getValueWithRatio(1.5);
    case 'xxlarge':
      return getValueWithRatio(1.7);
    case 'small':
      return getValueWithRatio(0.8);
    default:
      return getValueWithRatio(1);
  }
};

export const calculateRatio = (imagescale, fontsize, imageWidth) => {
  if (!imagescale) {
    return imageWidth * 1;
  }

  switch (fontsize) {
    case 'large':
      return imageWidth * 1.2;
    case 'xlarge':
      return imageWidth * 1.5;
    case 'xxlarge':
      return imageWidth * 1.7;
    case 'small':
      return imageWidth * 0.8;
    default:
      return imageWidth * 1;
  }
};

export const preventEvent = (e) => {
  e.preventDefault();
};
