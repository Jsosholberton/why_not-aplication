import jwt from "jsonwebtoken";

/**
 * Generates a JWT token (JSON Web Token) using the provided ID and JWT secret key.
 * @param {string} id - Unique identifier associated with the user for which the token is generated.
 * @returns {string} - Generated JWT token.
 */
const genJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export default genJWT;
