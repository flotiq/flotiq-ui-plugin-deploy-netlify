import {
  addElementToCache,
  getCachedElement,
} from '../../common/plugin-element-cache';
import { createNetlifyItem, updateNetlifyItem } from './panel-button';

const createPanelElement = (cacheKey) => {
  const panelElement = document.createElement('div');
  panelElement.classList.add('plugin-deploy-netlify');
  panelElement.id = cacheKey;
  panelElement.innerHTML = /*html*/ `
    <span id="plugin-deploy-netlify__header" class="plugin-deploy-netlify__header">
      Netlify builds
    </span>
    <div class="plugin-deploy-netlify__button-list"></div>
    <img class="plugin-deploy-netlify__logo" alt="Logo Netlify">
  `;

  addElementToCache(panelElement, cacheKey);

  return panelElement;
};

const updatePanelElement = (
  pluginContainer,
  settingsForCtd,
  contentObject,
  isCreating,
) => {
  const buttonList = pluginContainer.querySelector(
    '.plugin-deploy-netlify__button-list',
  );
  settingsForCtd.forEach((buttonSettings, index) => {
    const itemUniqueID = `netlify-item-child-${index}`;
    let htmlItem = buttonList.children[index];
    if (!htmlItem) {
      htmlItem = createNetlifyItem(itemUniqueID);
      buttonList.appendChild(htmlItem);
    }
    updateNetlifyItem(
      htmlItem,
      buttonSettings,
      contentObject,
      itemUniqueID,
      isCreating,
    );
    return htmlItem;
  });

  // Remove unnecessary items
  while (settingsForCtd.length < buttonList.children.length) {
    buttonList.children[buttonList.children.length - 1].remove();
  }
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

  if (!pluginContainer) {
    pluginContainer = createPanelElement(cacheKey);
  }

  updatePanelElement(
    pluginContainer,
    settingsForCtd,
    contentObject,
    isCreating,
  );

  return pluginContainer;
};
