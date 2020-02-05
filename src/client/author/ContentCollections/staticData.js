const optionsToDuplicate = [
  { label: "Item", value: "canDuplicateItem" },
  { label: "Test", value: "canDuplicateTest" },
  { label: "Playlist", value: "canDuplicatePlayList" }
];

const optionsToSee = [{ label: "Item", value: "isItemVisible" }, { label: "Test", value: "isTestVisible" }];

const roleOptions = [
  { label: "District Admin", value: "district-admin" },
  { label: "School Admin", value: "school-admin" },
  { label: "Instructor", value: "teacher" }
];

const permissionLevelOptions = [
  { label: "District", value: "DISTRICT" },
  { label: "School", value: "SCHOOL" },
  { label: "User", value: "USER" }
];

export default {
  optionsToDuplicate,
  optionsToSee,
  roleOptions,
  permissionLevelOptions
};
