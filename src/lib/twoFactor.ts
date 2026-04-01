export const TWO_FACTOR_METHOD = {
  NONE: "NONE",
  EMAIL: "EMAIL",
  SMS: "SMS",
} as const;

export type TwoFactorMethod = (typeof TWO_FACTOR_METHOD)[keyof typeof TWO_FACTOR_METHOD];

export const CHALLENGE_PURPOSE = {
  LOGIN: "LOGIN",
  PHONE_VERIFY: "PHONE_VERIFY",
} as const;

export const CHALLENGE_CHANNEL = {
  EMAIL: "EMAIL",
  SMS: "SMS",
} as const;

export function isTwoFactorMethod(v: string): v is TwoFactorMethod {
  return v === TWO_FACTOR_METHOD.NONE || v === TWO_FACTOR_METHOD.EMAIL || v === TWO_FACTOR_METHOD.SMS;
}
