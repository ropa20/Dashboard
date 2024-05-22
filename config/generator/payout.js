const generateConfig = {
  moduleName: "Payout",
  routeVersion: "v1",
  parameters: [
    {
      name: "driver",
      sensitive: false,
      type: "String",
      ref: 'driver',
      isUploadable: false,
      isRequired: true,
      isSearchable: false,
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
      name: "amount",
      sensitive: false,
      type: "Number",
      isUploadable: false,
      isRequired: true,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "payment_type",
      sensitive: false,
      type: "String",
      isUploadable: false,
      isRequired: true,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "payment_id",
      sensitive: false,
      type: "String",
      isUploadable: false,
      isRequired: true,
      isSearchable: false,
      isEditable: true,
    }
  ]
}

module.exports = generateConfig;