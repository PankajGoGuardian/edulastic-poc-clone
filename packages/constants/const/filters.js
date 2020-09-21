const SMART_FILTERS = {
  ENTIRE_LIBRARY: "ENTIRE_LIBRARY",
  AUTHORED_BY_ME: "AUTHORED_BY_ME",
  SHARED_WITH_ME: "SHARED_WITH_ME",
  CO_AUTHOR: "CO_AUTHOR",
  PREVIOUSLY_USED: "RECENT_PLAYLISTS",
  FAVORITES: "FAVORITES",
  FOLDERS: "FOLDERS"
};

const testSearchFields = [
  "createdAt",
  "authoredByIds",
  "searchString",
  "tags",
  "grades",
  "subject",
  "curriculumId",
  "domainIds",
  "standardIds",
  "questionType",
  "depthOfKnowledge",
  "authorDifficulty",
  "filter",
  "collections",
  "status",
  "_ids",
  "folderId"
];

const itemSearchFields = [
  "createdAt",
  "createdById",
  "searchString",
  "ownedByIds",
  "authoredByIds",
  "subject",
  "curriculumId",
  "standardIds",
  "skillIdentifiers",
  "questionType",
  "depthOfKnowledge",
  "authorDifficulty",
  "grades",
  "tags",
  "filter",
  "collections",
  "status",
  "_ids",
  "folderId"
];

module.exports = { SMART_FILTERS, testSearchFields, itemSearchFields };
