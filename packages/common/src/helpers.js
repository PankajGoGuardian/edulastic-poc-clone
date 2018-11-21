export const ALPHABET = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

const getPaginationInfo = ({ page, limit, count }) => ({
  from: (page - 1) * limit + 1,
  to: limit * page > count ? count : limit * page,
});

const getNumeration = (index, type) => {
  switch (type) {
    case 'number':
      return index + 1;
    case 'upper-alpha':
      return ALPHABET[index].toUpperCase();
    case 'lower-alpha':
      return ALPHABET[index].toLowerCase();
    default:
      return index + 1;
  }
};

export default {
  getDisplayName,
  getPaginationInfo,
  getNumeration,
};
