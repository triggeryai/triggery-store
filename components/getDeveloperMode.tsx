// lib/getDeveloperMode.ts
import DeveloperMode from '../lib/models/DeveloperMode';

export const getDeveloperMode = async () => {
  const devMode = await DeveloperMode.findOne();
  return devMode?.isDeveloperMode ?? false;
};
