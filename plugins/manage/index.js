import { getSettingsSchema } from './settings-schema';

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

  configCache.schema = getSettingsSchema(pluginInfo, ctds);

  modalInstance.promise.then(() => (configCache = null));

  return configCache;
};
