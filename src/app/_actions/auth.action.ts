"use server";

import { runAction, runValidatedAction } from "@/lib/runAction";
import { clearSessionToken, setSessionToken } from "@/lib/session";
import { changePassword, login, logout, updateSettings } from "@/services/auth.services";
import { changePasswordFormZodSchema, loginFormZodSchema, settingsFormZodSchema } from "@/zod/auth.validation";

// The token is stored in the httpOnly cookie here and never returned to the browser.
export const loginAction = async (values: unknown) =>
  runValidatedAction(loginFormZodSchema, values, async (data) => {
    const result = await login(data);
    await setSessionToken(result.data.token, result.data.expires_at);
    return { ...result, data: null };
  });

export const logoutAction = async () => {
  const result = await runAction(() => logout());
  // Logged out locally even if the API could not be reached.
  await clearSessionToken();
  return result.success ? result : { success: true as const, message: "লগআউট হয়েছে", data: null };
};

export const changePasswordAction = async (values: unknown) =>
  runValidatedAction(changePasswordFormZodSchema, values, (data) => changePassword(data));

export const updateSettingsAction = async (values: unknown) =>
  runValidatedAction(settingsFormZodSchema, values, (data) => updateSettings(data));
