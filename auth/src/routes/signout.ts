import exress from "express";

const router = exress.Router();

router.post("/api/users/signout", (req, res) => {
  req.session = null;

  res.send({});
});

export { router as signoutRouter };
