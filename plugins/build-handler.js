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
  buttonElement.classList.add('loading');

  const writeStatus = (message) => {
    statusMessageContainer.innerHTML = message;
  };

  const pluginLink = `
    <a 
      class="plugin-dn-link" 
      href="${buildInstance}" 
      target="_blank">
        Go to page: ${buildInstance}
    </a>`;

  if (!buildWebhookURL) {
    writeStatus(pluginLink);
    return;
  } else {
    writeStatus('Updating preview link...');
  }

  return fetch(buildWebhookURL, {
    mode: 'no-cors',
    method: 'POST',
    body: JSON.stringify(contentObject),
    headers: {
      'content-type': 'application/json;charset=UTF-8',
    },
  })
    .then(() => {
      writeStatus(pluginLink);
      buttonElement.classList.remove('loading');
    })
    .catch((error) => {
      if (error.message) {
        writeStatus(error.message);
      } else {
        writeStatus('Failed to fetch');
      }
      buttonElement.classList.remove('loading');
    });
};
