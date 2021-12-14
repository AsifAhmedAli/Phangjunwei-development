















// const { verify, sign } = require("jsonwebtoken");
// const User = require("../../models/user");

// function setTokens(user) {
//     const sevenDays = 60 * 60 * 24 * 7 * 1000;
//     const fifteenMins = 60 * 15 * 1000;
//     const accessUser = {
//         id: user.id
//     };
//     const accessToken = sign(
//         { user: accessUser },
//         process.env.JWT_SECRET_ACCESS,
//         {
//             expiresIn: fifteenMins
//         }
//     );

//     const refreshUser = {
//         id: user.id,
//         count: user.tokenCount
//     };
//     const refreshToken = sign(
//         { user: refreshUser },
//         process.env.JWT_SECRET_REFRESH,
//         {
//             expiresIn: sevenDays
//         }
//     );

//     return {
//         accessToken,
//         refreshToken
//     };
// }

// function validateAccessToken(token) {
//     try {
//         return verify(token, process.env.JWT_SECRET_ACCESS);
//     } catch {
//         return null;
//     }
// }

// function validateRefreshToken(token) {
//     try {
//         return verify(token, process.env.JWT_SECRET_REFRESH);
//     } catch {
//         return null;
//     }
// }

// async function validateTokensMiddleware(req, res, next) {
//     const refreshToken = req.headers["x-refresh-token"];
//     const accessToken = req.headers["x-access-token"];

//     if (!accessToken && !refreshToken) {
//         return next();
//     }

//     const decodedAccessToken = validateAccessToken(accessToken);
//     if (decodedAccessToken && decodedAccessToken.user) {
//         req.user = decodedAccessToken.user;
//         return next();
//     }

//     console.log("AccessToken", decodedAccessToken);

//     const decodedRefreshToken = validateRefreshToken(refreshToken);
//     console.log("RefreshToken", decodedRefreshToken);
//     if (decodedRefreshToken && decodedRefreshToken.user) {
//         // valid refresh token
//         const userFound = await user.get({ userId: decodedRefreshToken.user.id });
//         console.log("UserFound", userFound);
//         // valid user and user token not invalidated
//         if (!userFound || userFound.tokenCount !== decodedRefreshToken.user.count)
//             return next();
//         req.user = decodedRefreshToken.user;
//         // refresh the tokens
//         const userTokens = setTokens(userFound);
//         console.log("Tokens", userTokens);
//         res.set({
//             "Access-Control-Expose-Headers": "x-access-token,x-refresh-token",
//             "x-access-token": userTokens.accessToken,
//             "x-refresh-token": userTokens.refreshToken
//         });
//         return next();
//     }
//     next();
// }

// module.exports = { setTokens, validateAccessToken, validateRefreshToken, validateTokensMiddleware };