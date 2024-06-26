import { registerFn } from '../common/plugin-element-cache';
import pluginInfo from '../plugin-manifest.json';
import cssString from 'inline:./sidebar-panel/style/style.css';
import { handlePanelPlugin } from './sidebar-panel';
import { handleManagePlugin } from './manage';
import { handleAfterSubmitPlugin } from './form-submit';
import { handleMigrate } from './migrations';

registerFn(pluginInfo, (handler, _, { getPluginSettings }) => {
  let style = document.getElementById(`${pluginInfo.id}-styles`);
  if (!style) {
    style = document.createElement('style');
    style.id = `${pluginInfo.id}-styles`;
    document.head.appendChild(style);
  }
  style.textContent = cssString;

  handler.on('flotiq.plugins.manage::form-schema', (data) =>
    handleManagePlugin(data, pluginInfo),
  );
  handler.on('flotiq.form.sidebar-panel::add', (data) =>
    handlePanelPlugin(data, getPluginSettings, pluginInfo),
  );
  handler.on('flotiq.form::after-submit', (data) =>
    handleAfterSubmitPlugin(data, getPluginSettings, pluginInfo),
  );

  handler.on('flotiq.plugin::migrate', handleMigrate);
});
