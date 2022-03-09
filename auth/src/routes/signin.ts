import exress, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError, validateRequest } from "@dgy-tickets/common";

import { User } from "../models/user";
import { Password } from "../services/password";

const router = exress.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("You must supply a password"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError("Invalid credentials");
    }

    const passwordMatch = Password.compare(existingUser.password, password);
    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    // Generate web token
    const userJwt = jwt.sign(
      { id: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY! // Set "!"" to tell typescript the condition is already verified
    );

    // Store in on session object
    req.session = { jwt: userJwt };

    return res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
