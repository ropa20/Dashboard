const generateConfig = {
  moduleName: "Address",
  routeVersion: "v1",
  parameters: [
    {
      name: "name",
      sensitive: false,
      type: "String",
      isUploadable: false,
      isRequired: true,
      isSearchable: true,
      isEditable: true,
    },
    {
      name: "user",
      sensitive: false,
      type: "String",
      ref: 'user',
      isUploadable: false,
      isRequired: true,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "latlong",
      sensitive: false,
      type: "String",
      isUploadable: false,
      isRequired: false,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "phone",
      sensitive: false,
      type: "String",
      isUploadable: false,
      isRequired: true,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "alternate_phone",
      sensitive: false,
      type: "String",
      isUploadable: false,
      isRequired: false,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "pincode",
      sensitive: false,
      type: "String",
      isUploadable: false,
      isRequired: true,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "type",
      sensitive: false,
      type: "String",
      isUploadable: false,
      isRequired: true,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "state",
      sensitive: false,
      type: "String",
      isUploadable: false,
      isRequired: true,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "city",
      sensitive: false,
      type: "String",
      isUploadable: false,
      isRequired: true,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "address",
      sensitive: false,
      type: "String",
      isUploadable: false,
      isRequired: true,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "landmark",
      sensitive: false,
      type: "String",
      isUploadable: false,
      isRequired: false,
      isSearchable: false,
      isEditable: true,
    },
  ]
}

module.exports = generateConfig;