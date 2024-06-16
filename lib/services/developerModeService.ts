// lib/services/developerModeService.ts
import DeveloperMode from '../models/DeveloperMode';

export const getDeveloperMode = async (): Promise<boolean> => {
  const developerMode = await DeveloperMode.findOne().exec();
  return developerMode ? developerMode.isDeveloperMode : false;
};
