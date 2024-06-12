let configCache = null;

export const handleManagePlugin = (
  { plugin, contentTypes, modalInstance },
  pluginInfo,
) => {
  if (plugin?.id !== pluginInfo.id) return null;

  if (configCache) return configCache;

  const ctds = (contentTypes || [])
    .filter((ctd) => !ctd.internal || ctd.name === '_media')
    .map(({ name }) => name);

  configCache = {};

  configCache.schema = {
    id: pluginInfo.id,
    name: 'netlify_build',
    label: 'Netlify build',
    workflowId: 'generic',
    internal: false,
    schemaDefinition: {
      type: 'object',
      allOf: [
        {
          $ref: '#/components/schemas/AbstractContentTypeSchemaDefinition',
        },
        {
          type: 'object',
          properties: {
            builds: {
              type: 'array',
              items: {
                type: 'object',
                required: ['build_instance_url'],
                properties: {
                  build_instance_url: {
                    type: 'string',
                    minLength: 1,
                  },
                  build_webhook_url: {
                    type: 'string',
                  },
                  content_types: {
                    type: 'array',
                    minLength: 1,
                  },
                  displayName: {
                    type: 'string',
                    default: 'Build site',
                  },
                  buildAutomaticallyOnSave: {
                    type: 'boolean',
                    default: true,
                  },
                },
              },
            },
          },
        },
      ],
      required: [],
      additionalProperties: false,
    },
    metaDefinition: {
      order: ['builds'],
      propertiesConfig: {
        builds: {
          items: {
            order: [
              'build_instance_url',
              'build_webhook_url',
              'displayName',
              'content_types',
              'buildAutomaticallyOnSave',
            ],
            propertiesConfig: {
              build_instance_url: {
                label: 'Site url',
                unique: false,
                helpText: '',
                inputType: 'text',
              },
              build_webhook_url: {
                label: 'Build Webhook URL',
                unique: false,
                helpText: '',
                inputType: 'text',
              },
              content_types: {
                label: 'Content types',
                unique: false,
                options: ctds,
                helpText: '',
                inputType: 'select',
                isMultiple: true,
              },
              displayName: {
                label: 'Display name',
                unique: false,
                helpText: '',
                inputType: 'text',
              },
              buildAutomaticallyOnSave: {
                label: 'Build automatically on save',
                unique: false,
                helpText: '',
                inputType: 'checkbox',
              },
            },
          },
          label: 'Builds',
          unique: false,
          helpText: '',
          inputType: 'object',
        },
      },
    },
  };

  modalInstance.promise.then(() => (configCache = null));

  return configCache;
};
