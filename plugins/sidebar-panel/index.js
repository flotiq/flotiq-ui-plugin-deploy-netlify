import {
  addElementToCache,
  getCachedElement,
} from '../../common/plugin-element-cache';
import { getKeyPattern } from '../../common/plugin-helpers';

import { onBuildHandler } from '../build-handler';

const itemNetlify = (buttonSettings, contentObject, id, isCreating) => {
  const buildInstance = getKeyPattern(
    buttonSettings?.build_instance_url,
    contentObject,
  );
  const buttonLabel = getKeyPattern(
    buttonSettings?.displayName || 'Build site',
    contentObject,
  );

  const pluginContainerItem = document.createElement('div');
  pluginContainerItem.classList.add('plugin-dn-container-item');

  // :: Status
  const statusMessageContainer = document.createElement('div');
  statusMessageContainer.id = `${id}-status`;
  statusMessageContainer.classList.add('plugin-dn-status-message');

  // :: Button
  const pluginButton = document.createElement('button');
  pluginButton.id = `${id}-button`;
  pluginButton.classList.add('plugin-dn-button');
  pluginButton.innerText = buttonLabel;
  pluginButton.onclick = () =>
    onBuildHandler(buttonSettings, contentObject, id);

  // :: Button disabled status
  if (isCreating) {
    pluginButton.classList.add('disabled');
  } else {
    pluginButton.classList.remove('disabled');
  }

  // :: Message
  if (buildInstance && !isCreating) {
    statusMessageContainer.innerHTML = `
      <a 
        class="plugin-dn-link" 
        href="${buildInstance}" 
        target="_blank">
          Go to page: ${buildInstance}
      </a>`;
  }

  // :: Append new elements
  pluginContainerItem.appendChild(pluginButton);
  pluginContainerItem.appendChild(statusMessageContainer);

  // :: Checking if build instance

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
  { contentType, contentObject, create, duplicate },
  getPluginSettings,
  pluginInfo,
) => {
  const netlifySettings = getPluginSettings();

  if (!netlifySettings) return null;
  const settings = JSON.parse(netlifySettings);

  const settingsForCtd = settings?.builds?.filter(
    (plugin) =>
      plugin.content_types.length === 0 ||
      plugin.content_types.find((ctd) => ctd === contentType?.name),
  );

  if (!settingsForCtd.length) return null;
  const isCreating = duplicate || create;

  const cacheKey = `${pluginInfo.id}-${contentType?.name}-${
    isCreating ? contentObject?.id : 'new'
  }`;

  let pluginContainer = getCachedElement(cacheKey)?.element;

  if (!pluginContainer || isCreating) {
    pluginContainer = document.createElement('div');
    pluginContainer.classList.add('plugin-dn-container');

    const headerElement = document.createElement('span');
    headerElement.classList.add('plugin-dn-header');
    headerElement.id = 'plugin-dn-header';
    headerElement.innerText = 'Netlify Builds';

    pluginContainer.appendChild(headerElement);
    addElementToCache(pluginContainer, cacheKey);

    // Case: disable buttons on create item
    const items = settingsForCtd.map((item, index) => {
      const itemUniqueID = `netlify-item-child-${index}`;
      return itemNetlify(item, contentObject, itemUniqueID, isCreating);
    });

    pluginContainer.append(...items);

    const imgLogo = document.createElement('img');
    imgLogo.classList.add('plugin-dn-logo');

    imgLogo.alt = 'Logo Netlify';

    pluginContainer.appendChild(imgLogo);
  }

  return pluginContainer;
};
