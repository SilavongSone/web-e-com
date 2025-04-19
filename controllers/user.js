const prisma = require("../config/prisma");
exports.listUsers = async (req, res) => {
  try {
    //code

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        enabled: true,
        address: true,
      },
    });

    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ massage: "Server Error In Controllers/user" });
  }
};
exports.changeStatus = async (req, res) => {
  try {
    //code
    const { id, enabled } = req.body;
    console.log(id, enabled);
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { enabled: enabled },
    });

    res.send("Update Status Success");
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Server Error In Controllers/user/exports.changeStatus",
    });
  }
};

exports.changeRole = async (req, res) => {
  try {
    //code
    const { id, role } = req.body;
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { role: role },
    });

    res.send("Change Role Success");
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ massage: "Server Error In Controllers/user/exports.changeRole" });
  }
};
exports.userCart = async (req, res) => {
  try {
    const { cart } = req.body;
    console.log(cart);
    console.log(req.user.id);

    // Find user
    const user = await prisma.user.findFirst({
      where: { id: Number(req.user.id) },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find user's cart
    const userCart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: { products: true }, // Include products in the cart
    });

    if (userCart) {
      // Delete products from cart first
      await prisma.productOnCart.deleteMany({
        where: { cartId: userCart.id },
      });

      // Delete the cart itself
      await prisma.cart.deleteMany({
        where: { userId: user.id },
      });
    }

    res.send("Hello from userCart");
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error In Controllers/user/exports.userCart" });
  }
};



// exports.userCart = async (req, res) => {
//   try {
//     //code

//     // const users = await prisma.user.findMany();
//     res.send("Hello from userCart");
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       massage: "Server Error In Controllers/user/exports.userCart",
//     });
//   }
// };
exports.getUserCart = async (req, res) => {
  try {
    //code

    // const users = await prisma.user.findMany();
    res.send("Hello from getUserCart");
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Server Error In Controllers/user/exports.getUserCart",
    });
  }
};
exports.emptyCart = async (req, res) => {
  try {
    //code

    // const users = await prisma.user.findMany();
    res.send("Hello from emptyCart");
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ massage: "Server Error In Controllers/user/exports.emptyCart" });
  }
};
exports.saveAddress = async (req, res) => {
  try {
    //code

    // const users = await prisma.user.findMany();
    res.send("Hello from saveAddress");
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Server Error In Controllers/user/exports.saveAddress",
    });
  }
};
exports.saveOrder = async (req, res) => {
  try {
    //code

    // const users = await prisma.user.findMany();
    res.send("Hello from saveOrder");
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ massage: "Server Error In Controllers/user/exports.saveOrder" });
  }
};
exports.getOrder = async (req, res) => {
  try {
    //code

    // const users = await prisma.user.findMany();
    res.send("Hello from getOrder");
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ massage: "Server Error In Controllers/user/exports.getOrder" });
  }
};
