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

export const DISABLE_SUBMIT_TITLE = "Disabled since Sync Enabled";

export const radioButtonUserData = {
  UPGRADE: "Upgrade",
  REVOKE: "Revoke",
  get list() {
    return [this.UPGRADE, this.REVOKE];
  }
};

export const GRADES_LIST = [
  {
    label: "All",
    value: "All"
  },
  {
    label: "Kindergarten",
    value: "K"
  },
  {
    label: "Grade 1",
    value: "1"
  },
  {
    label: "Grade 2",
    value: "2"
  },
  {
    label: "Grade 3",
    value: "3"
  },
  {
    label: "Grade 4",
    value: "4"
  },
  {
    label: "Grade 5",
    value: "5"
  },
  {
    label: "Grade 6",
    value: "6"
  },
  {
    label: "Grade 7",
    value: "7"
  },
  {
    label: "Grade 8",
    value: "8"
  },
  {
    label: "Grade 9",
    value: "9"
  },
  {
    label: "Grade 10",
    value: "10"
  },
  {
    label: "Grade 11",
    value: "11"
  },
  {
    label: "Grade 12",
    value: "12"
  }
];

export const SUBJECTS_LIST = [
  "All",
  "Science",
  "Other Subjects",
  "Mathematics",
  "Social Studies",
  "ELA",
  "Computer Science"
];

export const SUBSCRIPTION_TYPE_CONFIG = {
  free: {
    free: {
      label: "Apply Changes",
      subTypeToBeSent: "free"
    },
    enterprise: {
      label: "Upgrade",
      subTypeToBeSent: "enterprise"
    }
  },
  premium: {
    free: {
      label: "Revoke",
      subTypeToBeSent: "free"
    },
    premium: {
      label: "Apply Changes",
      subTypeToBeSent: "premium"
    }
  },
  partial_premium: {
    enterprise: {
      label: "Upgrade",
      subTypeToBeSent: "enterprise"
    },
    free: {
      label: "Revoke",
      subTypeToBeSent: "free"
    },
    partial_premium: {
      label: "Apply Changes",
      subTypeToBeSent: "partial_premium"
    }
  },
  enterprise: {
    free: {
      label: "Revoke",
      subTypeToBeSent: "free"
    },
    enterprise: {
      label: "Apply Changes",
      subTypeToBeSent: "enterprise"
    }
  }
};

export const subscriptionAdditionalDetails = [
  {
    fieldName: "customerSuccessManager",
    label: "CS Manager",
    placeholder: "Customer success manager",
    type: "string"
  },
  {
    fieldName: "opportunityId",
    label: "Opportunity Id",
    placeholder: "Opportunity id",
    type: "string"
  },
  {
    fieldName: "licenceCount",
    label: "Licence Count",
    placeholder: "Licence count",
    type: "number"
  }
];
