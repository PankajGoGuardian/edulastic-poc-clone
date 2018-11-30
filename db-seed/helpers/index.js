const { ObjectID } = require('mongodb');
const { createHash } = require('crypto');

const getObjectId = (name) => {
  const hash = createHash('sha1')
    .update(name, 'utf8')
    .digest('hex');

  return new ObjectID(hash.substring(0, 24));
};


module.exports = {
  getObjectId
};
