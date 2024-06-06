[[_TOC_]]

# About plugin

Netlify is the platform for building highly-performant and dynamic websites, e-commerce stores and web applications. With this plugin, you can easily trigger Netlify builds within Content Object changes on form submission. You will also be able to quickly navigate to your Netlify pages from the Flotiq content editor.

## Plugin outcome

In the sidebar of the Content Object form, you will see a panel with the Netlify build buttons. Once you click the button, a link to preview the page will appear below the button.

<img src=".docs/images/netlify_plugin.png" alt="plugin-item" width="1000"/>

## Configuring plugin

To manage a plugin, you must first add it to your plugins. Click the "+" icon to add the plugin to your library and click the "Manage" button. It will open the plugin settings.

<img src=".docs/images/netlify_settings.png" alt="plugin-settings" width="700"/>

To complete the form, you must log in to your Netlify account. In the app's general data, under the app name, you'll find the `Build Instance URL`.

<img src=".docs/images/app_url.png" alt="instance-url" width="700"/>

To find `Build Webhook URL` go to `Site Configuration` -> `Build & deploy` -> `Build hooks`. You need to add a build hook and copy the provided URL.

<img src=".docs/images/hook_url.png" alt="hook-url" width="1000"/>

Other fields:

* `Display name` - Any name that will be displayed on the build button.
* `Content Type Definition` - Select the content type to display the button only for the specified content type. If the content type is not selected, the button will be shown when editing each content object.

# Development

## Quick start

1. `yarn` - to install dependencies
2. `yarn start` - to start development mode - rebuild on file modifications
3. update your `plugin-manifest.json` file to contain the production URL and other plugin information
4. `yarn build` - to build plugins

## Dev environment

Dev environment is configured to use:

* `prettier` - best used with automatic format on save in IDE
* `eslint` - it is built into both `start` and `build` commands

## Output

The plugins are built into a single `dist/index.js` file. The manifest is copied to `dist/plugin-manifest.json` file.

## Deployment

<!-- TO DO -->

## Loading the plugin

**Warning:** While developing, you can use  `https://localhost:3053/plugin-manifest.json` address to load the plugin manifest. Make sure your browser trusts the local certificate on the latter, to be able to use it e.g. with `https://editor.flotiq.com`

### URL

**Hint**: You can use localhost url from development mode `https://localhost:3053/index.js`

1. Open Flotiq editor
2. Open Chrome Dev console
3. Execute the following script
   ```javascript
   FlotiqPlugins.loadPlugin('plugin-id', '<URL TO COMPILED JS>')
   ```
4. Navigate to the view that is modified by the plugin

### Directly

1. Open Flotiq editor
2. Open Chrome Dev console
3. Paste the content of `dist/index.js` 
4. Navigate to the view that is modified by the plugin

### Deployment

**Hint**: You can use localhost url from development mode `https://localhost:3053/plugin-manifest.json`

1. Open Flotiq editor
2. Add a new plugin and paste the URL to the hosted `plugin-manifest.json` file
3. Navigate to the view that is modified by the plugin