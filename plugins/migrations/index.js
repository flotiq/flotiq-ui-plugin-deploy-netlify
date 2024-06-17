import semver from 'semver';

const settingsMigrations = [
  {
    from: '1.1.2',
    to: '1.1.3',
    migration: async (settings) => {
      settings.builds.forEach((itemSettings) => {
        if (typeof itemSettings.build_on_save === 'undefined') {
          itemSettings.build_on_save = true;
        }
        return itemSettings;
      });

      return settings;
    },
  },
];

export const handleMigrate = async ({ previousVersion }) => {
  let settings = previousVersion.settings
    ? JSON.parse(previousVersion.settings)
    : [];

  let versionNumber = previousVersion.version;
  let migration;

  const isNext = (m) =>
    semver.gte(m.from, versionNumber) && semver.lt(versionNumber, m.to);

  while ((migration = settingsMigrations.find(isNext))) {
    settings = await migration.migration(settings);
    versionNumber = migration.to;
  }

  return JSON.stringify(settings);
};
