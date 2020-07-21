export const apiForms = [
  {
    id: "configurereports",
    name: "Configure Reports",
    endPoint: "custom-report",
    method: "post",
    fields: [
      {
        name: "title",
        displayName: "Report Name",
        placeholder: "Enter Report Name",
        type: "string",
        required: true
      },
      {
        name: "url",
        displayName: "Tableau View Url",
        placeholder: "Enter Tableau View Url",
        type: "string",
        required: true
      },
      {
        name: "description",
        displayName: "Report Description",
        placeholder: "Enter Report Description",
        type: "textarea",
        required: false
      },
      {
        name: "thumbnail",
        displayName: "Report Thumbnail",
        placeholder: "Enter Report Thumbnail",
        type: "string",
        required: false
      }
    ]
  },
  {
    id: "custom-report-auth",
    name: "Configure Report Authorization",
    endPoint: "custom-report/user",
    method: "post",
    fields: [
      {
        name: "districtId",
        displayName: "District",
        placeholder: "Enter district id",
        type: "string",
        required: true,
        validate: {
          endPoint: "custom-report/user",
          method: "get",
          paramsType: "string",
          multiple: false,
          validateField: "id",
          response: {
            lodashDepth: "result",
            display: {
              type: "json",
              title: "Existing user of selected district "
            }
          }
        }
      },
      {
        name: "username",
        displayName: "Username",
        placeholder: "Enter tableau username",
        type: "string",
        required: true
      },
      {
        name: "csManager",
        displayName: "CS Manager",
        placeholder: "Enter cs manager name",
        type: "string",
        required: true
      },
      {
        name: "notes",
        displayName: "Notes",
        placeholder: "Enter notes",
        type: "textarea",
        required: true
      }
    ]
  },
  {
    id: "upgradeuser",
    name: "Upgrade User",
    endPoint: "subscription",
    method: "post",
    fields: [
      {
        name: "userIds",
        displayName: "Users",
        placeholder: "Enter comma separated Email IDs",
        type: "textarea",
        required: true,
        validate: {
          endPoint: "search/users/by-emails",
          multiple: true,
          validateField: "emails",
          response: {
            lodashDepth: "result.data",
            display: {
              type: "table",
              title: "List of valid Email-Ids",
              fields: [
                {
                  field: "_id",
                  name: "Id"
                },
                {
                  field: "subscription.subType",
                  name: "Type"
                },
                {
                  field: "_source.email",
                  name: "Email"
                },
                {
                  field: "subscription.notes",
                  name: "Notes"
                }
              ]
            }
          }
        }
      },
      {
        name: "subStartDate",
        displayName: "Subscription Start Date",
        placeholder: "Enter start date",
        type: "date",
        required: true
      },
      {
        name: "subEndDate",
        displayName: "Subscription End Date",
        placeholder: "Enter end date",
        type: "date",
        required: true
      },
      {
        name: "notes",
        displayName: "Notes",
        placeholder: "Enter notes",
        type: "textarea",
        required: true
      },
      {
        name: "subType",
        displayName: "Subscription Type",
        placeholder: "Enter type",
        type: "string",
        required: true
      }
    ]
  },
  {
    id: "delta-sync",
    name: "Trigger Clever Delta Sync",
    endPoint: "clever/delta-sync",
    method: "post",
    fields: [
      {
        name: "caution",
        displayName: "Caution",
        message: "Delta sync takes time to complete, so don't trigger it frequently.",
        placeholder: "",
        type: "p",
        required: false
      }
    ]
  },
  {
    id: "power-tools",
    name: "Enable Power Tools For Users",
    endPoint: "user/power-teacher",
    method: "post",
    note: {
      text: "**Power tools can be enabled for DA, SA and Teachers",
      parentField: "usernames",
      position: "bottom",
      align: "right"
    },
    fields: [
      {
        name: "usernames",
        displayName: "Username/Email",
        placeholder: "Enter teacher username or email in comma separated",
        type: "textarea",
        formatter: value => value.split(",")?.map(v => v.trim()),
        required: true
      },
      {
        name: "enable",
        placeholder: "Enable/Disable",
        type: "radiogroup",
        values: ["enable", "disable"],
        formatter: value => value === "enable",
        required: true
      }
    ]
  },
  {
    id: "other1",
    name: "Other 1",
    endPoint: "other1",
    method: "post",
    fields: [
      {
        name: "field1",
        displayName: "field1",
        placeholder: "field1",
        type: "date",
        required: true
      },
      {
        name: "field2",
        displayName: "field2",
        placeholder: "field2",
        type: "checkbox",
        required: true
      },
      {
        name: "field3",
        placeholder: "field3",
        type: "radiogroup",
        values: ["option1", "option2", "option3", "option4"],
        required: true
      },
      {
        name: "field4",
        displayName: "field4",
        placeholder: "field4",
        type: "dropdown",
        required: true,
        values: ["option1", "option2", "option3", "option4"]
      }
    ]
  },
  {
    id: "enable-desmos",
    name: "Enable Desmos Calculator for District",
    endPoint: "subscription/enable-desmos",
    method: "put",
    fields: [
      {
        name: "districtId",
        displayName: "District ID",
        placeholder: "Enter districtId",
        type: "string",
        required: true
      },
      {
        key: "enableDisableDesmosRadio",
        name: "enable",
        placeholder: "Enable/Disable",
        type: "radiogroup",
        values: ["enable", "disable"],
        defaultValue: "disable",
        formatter: value => value === "enable"
      }
    ]
  }
];
