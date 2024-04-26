import { registerFn } from '../common/plugin-element-cache';
import pluginInfo from '../plugin-manifest.json';
import { handlePanelPlugin } from './deply-netlify';
import { handleManagePlugin } from './manage';
import cssString from 'inline:./deply-netlify/style/style.css';

registerFn(pluginInfo, (handler) => {
  if (!document.getElementById(`${pluginInfo.id}-styles`)) {
    const style = document.createElement('style');
    style.id = `${pluginInfo.id}-styles`;
    style.textContent = cssString;
    document.head.appendChild(style);
  }

  handler.on('flotiq.plugins.manage::form-schema', (data) =>
    handleManagePlugin(data, pluginInfo),
  );
  handler.on('flotiq.form.sidebar-panel::add', (data) =>
    handlePanelPlugin(data, pluginInfo),
  );
});
