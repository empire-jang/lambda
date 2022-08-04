const router = require("express").Router();

// controllers
const StaffController = require("../controllers/staff");

//middlewares
const auth = require("../middlewares/auth");
const permissions = require("../middlewares/permissions");
const validate = require("../middlewares/validate");

// validators
const { staffSchema } = require("../validators/staff");

router.get("/", StaffController.getAll);

router.use(auth, permissions(["admin"]))

router.post("/", validate(staffSchema), StaffController.create);

router.put("/:id", validate(staffSchema), StaffController.update);

router.delete("/:id", StaffController.remove);

module.exports = router;
