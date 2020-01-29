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
  }
];
