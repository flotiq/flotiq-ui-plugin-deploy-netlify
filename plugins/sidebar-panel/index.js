import {
  addElementToCache,
  getCachedElement,
} from '../../common/plugin-element-cache';

const onBuildHandler = (data, statusMessageContainer) => {
  const buildWebhookURL = data?.build_webhook_url;
  const buildInstance = data?.build_instance_url;

  writeMessage('Updating preview link...', statusMessageContainer);

  if (!buildWebhookURL) {
    writeMessage(
      `<a class="plugin-dn-link" href="${buildInstance}" target="_blank">Open page (build may be still pending)</a>`,
      statusMessageContainer,
    );
    return;
  }

  return fetch(buildWebhookURL, {
    method: `POST`,
    body: '{}',
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  })
    .then(() => {
      writeMessage(
        `<a class="plugin-dn-link" href="${buildInstance}" target="_blank">Open page (build may be still pending)</a>`,
        statusMessageContainer,
      );
    })
    .catch((error) => {
      if (error.message) {
        writeMessage(error.message, statusMessageContainer);
      } else {
        writeMessage('Failed to fetch', statusMessageContainer);
      }
    });
};

const writeMessage = (message, statusMessageContainer) => {
  statusMessageContainer.innerHTML = message || '';
  statusMessageContainer.style.display = 'block';
};

const itemNetlify = (data) => {
  const pluginContainerItem = document.createElement('div');
  pluginContainerItem.classList.add('plugin-dn-container-item');

  // :: Status
  const statusMessageContainer = document.createElement('div');
  statusMessageContainer.classList.add('plugin-dn-status-message');

  // :: Button
  const pluginButton = document.createElement('button');
  pluginButton.classList.add('plugin-dn-button');
  pluginButton.innerText = data?.displayName || 'Build site';
  pluginButton.onclick = () => onBuildHandler(data, statusMessageContainer);

  // :: Images
  const imgLogo = document.createElement('img');
  imgLogo.classList.add('plugin-dn-logo');

  imgLogo.alt = 'Logo Netlify';

  // :: Append new elements
  pluginContainerItem.appendChild(pluginButton);
  pluginContainerItem.appendChild(statusMessageContainer);
  pluginContainerItem.appendChild(imgLogo);

  // :: Checking if build instante
  const buildInstance = data?.build_instance_url;

  if (!buildInstance) {
    pluginButton.classList.add('disabled');
    pluginButton.disabled = true;
    statusMessageContainer.classList.add('active');
    statusMessageContainer.innerText =
      "Can't find build instance url. Check the plugin settings.";
  }

  return pluginContainerItem;
};

export const handlePanelPlugin = (
  { contentType, contentObject, userPlugins },
  pluginInfo,
) => {
  const netlifySettings = userPlugins?.find(
    ({ id }) => id === pluginInfo.id,
  )?.settings;

  if (!netlifySettings) return null;

  const settingsForCtd = JSON.parse(netlifySettings)?.builds?.filter(
    (plugin) =>
      plugin.content_types.length === 0 ||
      plugin.content_types.find((ctd) => ctd === contentType?.name),
  );

  if (!settingsForCtd.length) return null;

  const cacheKey = `${pluginInfo.id}-${contentType?.name}-${
    contentObject?.id || 'new'
  }`;

  let pluginContainer = getCachedElement(cacheKey)?.element;

  if (!pluginContainer) {
    pluginContainer = document.createElement('div');
    pluginContainer.classList.add('plugin-dn-container');

    const headerElement = document.createElement('span');
    headerElement.classList.add('plugin-dn-header');
    headerElement.id = 'plugin-dn-header';
    headerElement.innerText = 'Netlify Builds';

    pluginContainer.appendChild(headerElement);

    const items = settingsForCtd.map((item) => itemNetlify(item));
    pluginContainer.append(...items);

    addElementToCache(pluginContainer, cacheKey);
  }

  return pluginContainer;
};
