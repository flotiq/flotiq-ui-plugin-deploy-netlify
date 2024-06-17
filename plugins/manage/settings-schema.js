export function getSettingsSchema(pluginInfo, ctds) {
  return {
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
                  build_on_save: {
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
              'build_on_save',
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
              build_on_save: {
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
}
