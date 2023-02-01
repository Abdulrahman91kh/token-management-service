export const checkIsTokenExpired = (tokenTimeStamp: number, expiryAfterDays: number) => {
    return tokenTimeStamp > expiryAfterDays;
};