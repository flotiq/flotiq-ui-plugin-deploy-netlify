import {
  addElementToCache,
  getCachedElement,
} from '../../common/plugin-element-cache';

import { deepReadKeyValue } from '../../common/plugin-helpers';

const netlifyBuildRef = { isUpdated: false, item: {} };

const onBuildHandler = (data, statusMessageContainer, object, buttonId) => {
  const buildWebhookURL = data?.build_webhook_url;
  const buildInstance = data?.build_instance_url;

  const buttonElement = document.getElementById(buttonId);
  buttonElement.classList.add('loading');

  writeMessage('Updating preview link...', statusMessageContainer);

  if (!buildWebhookURL) {
    writeMessage(
      `<a class="plugin-dn-link" href="${buildInstance}" ` +
        `target="_blank">Open page (build may be still pending)</a>`,
      statusMessageContainer,
    );
    return;
  }

  return fetch(buildWebhookURL, {
    mode: 'no-cors',
    method: 'POST',
    body: JSON.stringify(object),
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  })
    .then(() => {
      writeMessage(
        `<a class="plugin-dn-link" href="${buildInstance} ` +
          `target="_blank">Go to page: ${buildInstance}</a>`,
        statusMessageContainer,
      );
      buttonElement.classList.remove('loading');
    })
    .catch((error) => {
      if (error.message) {
        writeMessage(error.message, statusMessageContainer);
      } else {
        writeMessage('Failed to fetch', statusMessageContainer);
      }
      buttonElement.classList.remove('loading');
    });
};

const writeMessage = (message, statusMessageContainer) => {
  statusMessageContainer.innerHTML = message || '';
  statusMessageContainer.style.display = 'block';
};

const getKeyPattern = (value, source) => {
  return value.replace(/{(?<key>[^{}]+)}/g, (...params) => {
    const { key } = params[4];
    return deepReadKeyValue(key, source) || '';
  });
};

const itemNetlify = (data, object, isUpdated, id, isDisabled) => {
  const pluginContainerItem = document.createElement('div');
  pluginContainerItem.classList.add('plugin-dn-container-item');

  // :: Status
  const statusMessageContainer = document.createElement('div');
  statusMessageContainer.id = `statusMessageContainer-${id}`;
  statusMessageContainer.classList.add('plugin-dn-status-message');

  // :: Button
  const pluginButton = document.createElement('button');
  pluginButton.id = `button-${id}`;
  pluginButton.classList.add('plugin-dn-button');
  pluginButton.innerText = data?.displayName || 'Build site';
  pluginButton.onclick = () =>
    onBuildHandler(data, statusMessageContainer, object, `button-${id}`);

  // :: Button disabled status
  if (isDisabled) {
    pluginButton.classList.add('disabled');
  } else {
    pluginButton.classList.remove('disabled');
  }

  // :: Message
  if (data?.build_instance_url && !isDisabled) {
    writeMessage(
      `<a class="plugin-dn-link" href="${data?.build_instance_url} "` +
        `target="_blank">Go to page: ${data?.build_instance_url}</a>`,
      statusMessageContainer,
    );
  }

  // :: Build on save
  if (data.buildAutomaticallyOnSave && object && isUpdated) {
    clearTimeout(netlifyBuildRef.item[id]);

    netlifyBuildRef.item[id] = setTimeout(() => {
      onBuildHandler(data, statusMessageContainer, object, `button-${id}`);
      netlifyBuildRef.isUpdated = false;
    }, 1000);
  }

  // :: Images
  const imgLogo = document.createElement('img');
  imgLogo.classList.add('plugin-dn-logo');

  imgLogo.alt = 'Logo Netlify';

  // :: Append new elements
  pluginContainerItem.appendChild(pluginButton);
  pluginContainerItem.appendChild(statusMessageContainer);
  pluginContainerItem.appendChild(imgLogo);

  // :: Checking if build instance
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
  { contentType, contentObject, userPlugins, create, isSaving },
  pluginInfo,
) => {
  // On save reference
  if (isSaving && !netlifyBuildRef.isUpdated) {
    netlifyBuildRef.isUpdated = true;
  }

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

  let cacheKey = `${pluginInfo.id}-${contentType?.name}-${
    contentObject?.id || 'new'
  }`;

  let pluginContainer = getCachedElement(cacheKey)?.element;

  if (!pluginContainer || netlifyBuildRef.isUpdated || create) {
    pluginContainer = document.createElement('div');
    pluginContainer.classList.add('plugin-dn-container');

    const headerElement = document.createElement('span');
    headerElement.classList.add('plugin-dn-header');
    headerElement.id = 'plugin-dn-header';
    headerElement.innerText = 'Netlify Builds';

    pluginContainer.appendChild(headerElement);

    // Case: disable buttons on create item
    const isDisabled = create;

    const items = settingsForCtd.map((item, index) => {
      return itemNetlify(
        {
          ...item,
          build_instance_url: getKeyPattern(
            item.build_instance_url,
            contentObject,
          ),
          build_webhook_url: getKeyPattern(
            item.build_webhook_url,
            contentObject,
          ),
          displayName: getKeyPattern(item.displayName, contentObject),
        },
        contentObject,
        netlifyBuildRef.isUpdated,
        `netlify-item-child-${index}`,
        isDisabled,
      );
    });

    pluginContainer.append(...items);

    addElementToCache(pluginContainer, cacheKey);
  }

  return pluginContainer;
};
