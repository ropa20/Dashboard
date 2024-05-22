const generateConfig = {
  moduleName: "Outsource",
  routeVersion: "v1",
  parameters: [
    {
      name: "organization",
      sensitive: false,
      type: "String",
      ref: 'organization',
      isUploadable: false,
      isRequired: true,
      isSearchable: false,
      isEditable: false,
    },
    {
      name: "store",
      sensitive: false,
      type: "String",
      ref: 'store',
      isUploadable: false,
      isRequired: true,
      isSearchable: false,
      isEditable: false,
    },
    {
      name: "driver",
      sensitive: false,
      type: "String",
      ref: 'driver',
      isUploadable: false,
      isRequired: true,
      isSearchable: false,
      isEditable: false,
    },
    {
      name: "start_time",
      sensitive: false,
      type: "Date",
      isUploadable: false,
      isRequired: true,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "end_time",
      sensitive: false,
      type: "Date",
      isUploadable: false,
      isRequired: false,
      isSearchable: false,
      isEditable: true,
    },
  ]
}

module.exports = generateConfig;