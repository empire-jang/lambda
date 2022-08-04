const createError = require("http-errors");
const Staff = require("../models/staff");

const getAll = async (req, res, next) => {
  try {
    const staff = await Staff.find();

    res.json(staff);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const result = req.body;

    const staff = await Staff.create(result);

    res.json(staff);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const id = req.params.id
    const result = req.body;

    const staff = await Staff.findOneAndUpdate({ _id: id }, result, { new: true });

    res.json(staff);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
    try {
      const id = req.params.id
  
      const { deletedCount } = await Staff.deleteOne({ _id: id });
      if (deletedCount < 1) throw new createError.NotFound("Staff not found")
  
      res.json({ message: "Staff deleted successfully" });
    } catch (err) {
      next(err);
    }
  };

module.exports = { getAll, create, update, remove };
