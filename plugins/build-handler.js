import { getKeyPattern } from '../common/plugin-helpers';

/**
 *
 * @param {object} buttonSettings
 * @param {*} contentObject
 * @param {string} id
 * @returns
 */
export const onBuildHandler = (buttonSettings, contentObject, id) => {
  const buildWebhookURL = getKeyPattern(
    buttonSettings?.build_webhook_url,
    contentObject,
  );
  const buildInstance = getKeyPattern(
    buttonSettings?.build_instance_url,
    contentObject,
  );
  const buttonId = `${id}-button`;
  const statusBoxId = `${id}-status`;

  const statusMessageContainer = document.getElementById(statusBoxId);
  const buttonElement = document.getElementById(buttonId);

  const updateStatus = (message) => {
    statusMessageContainer.innerHTML = message;
  };

  const pluginLink = /* html */ `
    <a 
      class="plugin-deploy-netlify__link" 
      href="${buildInstance}" 
      target="_blank">
        Go to page: ${buildInstance}
    </a>
  `;

  if (!buildWebhookURL) {
    updateStatus(pluginLink);
    return;
  } else {
    updateStatus('Updating preview link...');
  }

  buttonElement.disabled = true;
  buttonElement.classList.add('plugin-deploy-netlify__button--loading');
  return fetch(buildWebhookURL, {
    mode: 'no-cors',
    method: 'POST',
    body: JSON.stringify(contentObject),
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  })
    .then(() => updateStatus(pluginLink))
    .catch((error) => {
      if (error.message) {
        updateStatus(error.message);
      } else {
        updateStatus('Failed to fetch');
      }
    })
    .finally(() => {
      buttonElement.disabled = false;
      buttonElement.classList.remove('plugin-deploy-netlify__button--loading');
    });
};
