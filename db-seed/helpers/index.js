const { ObjectID } = require('mongodb');
const { createHash } = require('crypto');

const getObjectId = () => (new ObjectID());

const getObjectIdByName = (name) => {
  const hash = createHash('sha1')
    .update(name, 'utf8')
    .digest('hex');

  return new ObjectID(hash.substring(0, 24));
};

const curriculumOneId = getObjectIdByName('curriculumOne');

module.exports = {
  getObjectId,
  getObjectIdByName,
  curriculumOneId
};
