import { handlePanelPlugin } from './../sidebar-panel';

export const handleAfterSubmitPlugin = (
  data,
  getPluginSettings,
  pluginInfo,
) => {
  const { success, contentObject } = data;
  const ctdName = contentObject?.internal?.contentType;
  const settings = getPluginSettings();

  if (!success || !ctdName || !settings) return;

  handlePanelPlugin({ ...data, isAfterSubmit: true }, pluginInfo);
};
