import { authApi } from '../services/authApi';

export const logErrorToBackend = async (context: string, error: any) => {
  try {
    await authApi.logError({
      context,
      message: error?.message || 'Unknown error',
      stack: error?.stack || null,
      url: window?.location?.href || null,
      extra: typeof error === 'object' ? error : { raw: error },
    });
  } catch (logErr) {
    console.warn('Error while logging to backend:', logErr);
  }
};
