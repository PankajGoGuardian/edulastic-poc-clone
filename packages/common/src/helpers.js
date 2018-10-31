const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

const getPaginationInfo = ({ page, limit, count }) => ({
  from: (page - 1) * limit + 1,
  to: limit > count ? count : limit * page,
});

export default {
  getDisplayName,
  getPaginationInfo,
};
