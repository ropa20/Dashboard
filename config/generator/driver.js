const generateConfig = {
  moduleName: "Driver",
  routeVersion: "v1",
  parameters: [
    {
      name: "phone",
      sensitive: false,
      type: "String",
      isUploadable: false,
      isRequired: true,
      isSearchable: false,
      isEditable: false
    },
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
      name: "email",
      sensitive: false,
      type: "String",
      isUploadable: false,
      isRequired: true,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "emergency_contact",
      sensitive: false,
      type: "String",
      isUploadable: false,
      isRequired: false,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "own_vehicle",
      sensitive: false,
      type: "Boolean",
      isUploadable: false,
      isRequired: false,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "vehicle_insurance",
      sensitive: false,
      type: "String",
      isUploadable: true,
      isRequired: true,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "passport_size_photo",
      sensitive: false,
      type: "String",
      isUploadable: true,
      isRequired: true,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "aadhaar_card_front",
      sensitive: false,
      type: "String",
      isUploadable: true,
      isRequired: true,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "aadhaar_card_back",
      sensitive: false,
      type: "String",
      isUploadable: true,
      isRequired: true,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "driving_licence_front",
      sensitive: false,
      type: "String",
      isUploadable: true,
      isRequired: true,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "driving_licence_back",
      sensitive: false,
      type: "String",
      isUploadable: true,
      isRequired: true,
      isSearchable: false,
      isEditable: true,
    },
    {
      name: "pan_card",
      sensitive: false,
      type: "String",
      isUploadable: true,
      isRequired: false,
      isSearchable: false,
      isEditable: true,
    }
  ]
}

module.exports = generateConfig;