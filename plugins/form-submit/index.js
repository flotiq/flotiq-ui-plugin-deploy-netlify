import { onBuildHandler } from '../build-handler';

export const handleAfterSubmitPlugin = (data, getPluginSettings) => {
  const { success, contentObject } = data;
  const ctdName = contentObject?.internal?.contentType;
  const netlifySettings = getPluginSettings();

  if (!success || !ctdName || !netlifySettings) return;

  const settings = JSON.parse(netlifySettings);

  const settingsForCtd = settings?.builds
    ?.filter(
      (buttonSettings) =>
        buttonSettings.content_types.length === 0 ||
        buttonSettings.content_types.find((ctd) => ctd === ctdName),
    )
    .filter((buttonSettings) => buttonSettings.build_on_save);

  if (!settingsForCtd.length) return;

  settingsForCtd.forEach((buttonSettings, index) => {
    onBuildHandler(
      buttonSettings,
      contentObject,
      `netlify-item-child-${index}`,
    );
  });
};
