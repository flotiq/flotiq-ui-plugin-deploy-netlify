import { getKeyPattern } from '../../common/plugin-helpers';
import { onBuildHandler } from '../build-handler';

export const updateNetlifyItem = (
  htmlElement,
  buttonSettings,
  contentObject,
  id,
  isCreating,
) => {
  const buildInstance = getKeyPattern(
    buttonSettings?.build_instance_url,
    contentObject,
  );
  const buttonLabel = getKeyPattern(
    buttonSettings?.displayName || 'Build site',
    contentObject,
  );
  const buildWebhookURL = getKeyPattern(
    buttonSettings?.build_webhook_url,
    contentObject,
  );

  const pluginButton = htmlElement.querySelector(
    '.plugin-deploy-netlify__button',
  );
  const statusMessageContainer = htmlElement.querySelector(
    '.plugin-deploy-netlify__status-message',
  );

  // :: Update button label and onclick handler
  pluginButton.innerText = buttonLabel;
  pluginButton.onclick = () =>
    onBuildHandler(buttonSettings, contentObject, id);

  // :: Disable button if object is not yet saved
  pluginButton.disabled = isCreating || !buildWebhookURL;

  const updateInProgress = pluginButton.classList.contains(
    'plugin-deploy-netlify__button--loading',
  );

  // do not update status message if update is in progress
  if (updateInProgress) {
    return;
  }
  // :: Message
  if (buildInstance && !isCreating) {
    statusMessageContainer.innerHTML = /*html*/ `
      <a 
        class="plugin-deploy-netlify__link" 
        href="${buildInstance}" 
        target="_blank">
          Go to page: ${buildInstance}
      </a>
    `;
  } else if (isCreating) {
    statusMessageContainer.innerText = buildWebhookURL
      ? 'Save the object to build site'
      : '';
  }
};

export const createNetlifyItem = (id) => {
  const pluginContainerItem = document.createElement('div');
  pluginContainerItem.classList.add('plugin-deploy-netlify__item');

  pluginContainerItem.innerHTML = /* html */ `
    <button id="${id}-button" class="plugin-deploy-netlify__button">
      Build site
    </button>
    <div id="${id}-status" class="plugin-deploy-netlify__status-message"></div>
  `;

  return pluginContainerItem;
};
