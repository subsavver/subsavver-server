import jwt from "jsonwebtoken";
import config from "../config/config";

export function createPaymentToken(subscriptionId: string, userId: string) {
  const token = jwt.sign(
    {
      subId: subscriptionId,
      userId,
    },
    config.jwt_secret
  );

  return token;
}
