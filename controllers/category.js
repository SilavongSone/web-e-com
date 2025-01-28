const prisma = require("../config/prisma");
exports.create = async (req, res) => {
  try {
    //code
    const { name } = req.body;
    const category = await prisma.category.create({
      data: {
        name: name,
      },
    });
    res.send(category);
  } catch (err) {
    //err
    console.log(err);
    res.status(500).json({ massage: "Server Error In Controllers/category" });
  }
};
exports.list = async (req, res) => {
  try {
    //code
    const category = await prisma.category.findMany();
    res.send(category);
  } catch (err) {
    //err
    console.log(err);
    res
      .status(500)
      .json({ massage: "Server Error In Controllers/category/list" });
  }
};
exports.remove = async (req, res) => {
  try {
    //code
    const { id } = req.params;
    const category = await prisma.category.delete({
        where: {
            id: parseInt(id),
        },
    });

    res.send(category);
  } catch (err) {
    //err
    console.log(err);
    res
      .status(500)
      .json({ massage: "Server Error In Controllers/category/remove" });
  }
};
