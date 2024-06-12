import { registerFn } from '../common/plugin-element-cache';
import pluginInfo from '../plugin-manifest.json';
import cssString from 'inline:./sidebar-panel/style/style.css';
import { handlePanelPlugin } from './sidebar-panel';
import { handleManagePlugin } from './manage';

registerFn(pluginInfo, (handler, _) => {
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
