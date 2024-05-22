const generateConfig = {
  moduleName: 'Sample',
  routeVersion: 'v1',
  parameters: [
    {
      name: 'name',
      sensitive: false,
      type: 'String',
      isUploadable: false,
      isRequired: true,
      isSearchable: true,
      isEditable: true,
    },
    {
      name: 'email',
      sensitive: false,
      type: 'String',
      isUploadable: false,
      isRequired: true,
      isSearchable: true,
      isEditable: true,
    },
    {
      name: 'profile_picture',
      sensitive: false,
      type: 'String',
      isUploadable: true,
      isRequired: true,
      isSearchable: true,
      isEditable: true,
    },
    {
      name: 'created_by',
      sensitive: false,
      type: 'String',
      isUploadable: false,
      isRequired: false,
      ref: 'user',
      isSearchable: false,
      isEditable: false,
    },
  ],
};

module.exports = generateConfig;
