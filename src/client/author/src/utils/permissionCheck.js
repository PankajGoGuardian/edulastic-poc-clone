const entityPermissionMap = {
  item: "canDuplicateItem",
  test: "canDuplicateTest",
  playlist: "canDuplicatePlayList"
};

export const allowDuplicateCheck = (entityCollections = [], collections = [], entityType) => {
  if (!entityCollections.length) {
    return true;
  }
  const collectionsData = collections.filter(o => entityCollections.some(_o => _o._id === o._id));
  const bucketIdsWithDuplicatePermission = collectionsData.reduce((arr, cur) => {
    const bucketIds = cur.buckets.filter(b => b[entityPermissionMap[entityType]]).map(bu => bu._id);
    arr = [...arr, ...bucketIds];
    return arr;
  }, []);

  const bucketIds = entityCollections.flatMap(c => c.bucketIds);
  const isAllowDuplicate = bucketIdsWithDuplicatePermission.some(id => bucketIds.includes(id));
  return isAllowDuplicate;
};

export const allowContentEditCheck = (entityCollections = [], userCollections = []) => {
  if (!entityCollections || !entityCollections.length) {
    return true;
  }
  const writableCollections = userCollections.filter(item => item.accessLevel === "write" && item.status === 1);
  return entityCollections.every(cl => writableCollections.some(item => cl._id === item._id));
};
