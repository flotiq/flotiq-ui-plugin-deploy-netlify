export const handleAfterSubmitPlugin = (
  { success, contentObject },
  toast,
  getPluginSettings,
) => {
  const ctdName = contentObject?.internal?.contentType;
  const settings = getPluginSettings();

  if (!success || !ctdName || !settings) return;

  const settingsForCtd = JSON.parse(settings)?.builds?.filter(
    (plugin) =>
      plugin.content_types.length === 0 ||
      plugin.content_types.find((ctd) => ctd === ctdName),
  );

  if (!settingsForCtd.length) return null;

  settingsForCtd.map((item) =>
    fetch(item.build_webhook_url, {
      method: `POST`,
      body: '{}',
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    })
      .then(async ({ ok, status }) => {
        if (!ok)
          throw Error(
            `Failed to fetch Netlify build URL: ${item.build_instance_url}. Status: ${status}`,
          );
      })
      .catch((error) => {
        console.log(error);
        if (error.message) {
          toast.error(error.message);
        } else {
          toast.error(
            `Failed to fetch Netlify build URL: ${item.build_instance_url}`,
          );
        }
      }),
  );
};
