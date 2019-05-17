export const radioButtondata = {
  CLEVER_ID: "cleverid",
  DISTRICT_ID: "id",
  DISTRICT_NAME_ID: "name",
  get list() {
    return [
      {
        id: this.CLEVER_ID,
        label: "Clever id",
        message: "Please enter valid Clever ID"
      },
      {
        id: this.DISTRICT_ID,
        label: "District Id",
        message: "Please enter valid District ID"
      },
      {
        id: this.DISTRICT_NAME_ID,
        label: "District Name",
        message: "Please enter valid district name"
      }
    ];
  }
};

export const deltaSyncConfig = {
  studentDeltaMergeEnabled: "Student Merge Enabled Delta",
  studentFullMergeEnabled: "Student Merge Enabled Full",
  studentMergeAttribute: "Student Merge Attribute",
  teacherDeltaMergeEnabled: "Teacher Merge Enabled Delta",
  teacherFullMergeEnabled: "Teacher Merge Enabled Full",
  teacherMergeAttribute: "Teacher Merge Attribute"
};

export const CLASS_NAME_PATTERN_CONFIG = ["DEFAULT", "CNAME_TLNAME_PERIOD", "CNAME_TLNAME_TERM"];

export const DISTRICT_STATUS = ["Inactive", "Active"];

export const DISTRICT_SYNC_STATUS = {
  "1": "Not Configured",
  "2": "Approved",
  "3": "Setup Initiated",
  "4": "Merge Inprogress",
  "5": "Merge Completed",
  "6": "Delta Params Completed",
  "7": "Subject Mapping Completed",
  "8": "Setup Completed",
  "9": "Initial Sync",
  "10": "Full Sync"
};

export const LIST_CLEVER_SUBJECTS = [
  "english/language arts",
  "math",
  "science",
  "social studies",
  "language",
  "homeroom/advisory",
  "interventions/online learning",
  "technology and engineering",
  "PE and health",
  "arts and music",
  "other"
];

export const mapCountAsType = {
  schoolCount: {
    name: "Schools",
    type: "sch"
  },
  groupCount: {
    name: "Classes",
    type: "cls"
  },
  saCount: {
    name: "School Admins",
    type: "sa"
  },
  teacherCount: {
    name: "Teachers",
    type: "tch"
  },
  studentCount: {
    name: "Students",
    type: "stu"
  },
  daCount: {
    name: "District Admins",
    type: "da"
  }
};

export const CLEVER_DISTRICT_ID_REGEX = /^[0-9a-fA-F]{24}$/;
