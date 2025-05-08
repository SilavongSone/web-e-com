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
// exports.userCart = async (req, res) => {
//   try {
//     const { cart } = req.body;
//     console.log(cart);
//     console.log(req.user.id);

//     // Find user
//     const user = await prisma.user.findFirst({
//       where: { id: Number(req.user.id) },
//     });

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Find user's cart
//     // const userCart = await prisma.cart.findFirst({
//     //   where: { userId: user.id },
//     //   include: { products: true }, // Include products in the cart
//     // });
//     const userCart = await prisma.cart.findFirst({
//       where: { id: Number(req.user.id) },
//       include: { products: true }, // Include products in the cart
//     });
//     // console.log(user);
//     await prisma.productOnCart.deleteMany({
//       where: {
//         cart: {
//           orderedById: user.id,
//         },
//       },
//     });
//     //delete oldcart
//     await prisma.cart.deleteMany({
//       where: {
//         orderedById: user.id,
//       },
//     });
//     // cart ready
//     let products = cart.map((item) => {
//       return {
//         productId: item.id,
//         count: item.count,
//         price: item.price,
//       };
//     });
//     // cart caculate
//     let cartTotal = products.reduce((sum, item) => {
//       sum += item.price * item.count;
//       return sum;
//     }, 0);

//     // new cart
//     const newCart = await prisma.cart.create({
//       data: {
//         cartTotal: cartTotal,
//         orderedById: user.id,
//         products: {
//           createMany: {
//             data: products,
//           },
//         },
//       },
//     });

//     res.send("Add Cart Success");
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ message: "Server Error In Controllers/user/exports.userCart" });
//   }
// };
exports.userCart = async (req, res) => {
  try {
    const { cart } = req.body;
    const userId = Number(req.user.id);

    console.log(cart);
    console.log("User ID:", userId);

    // หาผู้ใช้
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "ບໍ່ພົບຜູ້ໃຊ້" });
    }

    // ตรวจสอบว่า product ที่ส่งมามีอยู่ในระบบจริงไหม
    const productIds = cart.map((item) => item.id);
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const existingProductIds = new Set(existingProducts.map(p => p.id));
    const invalidProducts = productIds.filter(id => !existingProductIds.has(id));

    if (invalidProducts.length > 0) {
      return res.status(400).json({ message: `ພົບ productId ທີ່ບໍ່ມີຢູ່ໃນລະບົບ: ${invalidProducts.join(", ")}` });
    }

    // ลบตะกร้าเก่า
    await prisma.productOnCart.deleteMany({
      where: {
        cart: {
          orderedById: userId,
        },
      },
    });

    await prisma.cart.deleteMany({
      where: {
        orderedById: userId,
      },
    });

    // เตรียมข้อมูลสินค้าในตะกร้า
    const products = cart.map((item) => ({
      productId: item.id,
      count: item.count,
      price: item.price,
    }));

    // คำนวณราคารวม
    const cartTotal = products.reduce((sum, item) => sum + item.price * item.count, 0);

    // สร้างตะกร้าใหม่
    await prisma.cart.create({
      data: {
        cartTotal,
        orderedById: userId,
        products: {
          createMany: {
            data: products,
          },
        },
      },
    });

    res.status(200).send("ເພີ່ມໃສ່ກະຕ່າສຳເລັດແລ້ວ");
  } catch (err) {
    console.error("ເກີດຄວາມຜິດພາດໃນ userCart:", err);
    res.status(500).json({ message: "user error in crontroler Server (userCart)" });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    //code
    // req.user.id
    const cart = await prisma.cart.findFirst({
      where: { orderedById: Number(req.user.id) },
      include: {
        products: {
          include: {
            product: true, // Include product details
          },
        },
      }, // Include products in the cart
    });
    // console.log(cart);
    // const users = await prisma.user.findMany();
    res.json({
      products: cart.products,
      cartTotal: cart.cartTotal,
    });
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
    const cart = await prisma.cart.findFirst({
      where: { orderedById: Number(req.user.id) },
      include: {
        products: {
          include: {
            product: true, // Include product details
          },
        },
      }, // Include products in the cart
    });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    await prisma.productOnCart.deleteMany({
      where: {
        cart: {
          orderedById: Number(req.user.id),
        },
      },
    });
    const result = await prisma.cart.deleteMany({
      where: {
        orderedById: Number(req.user.id),
      },
    });

    console.log(cart);

    // const users = await prisma.user.findMany();
    res.send("Empty Cart Success");
    deletedCount = result.count;
    if (deletedCount > 0) {
      console.log(`Deleted ${deletedCount} cart(s)`);
    } else {
      console.log("No carts found to delete.");
    }
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
    const { address } = req.body;
    console.log(address);
    const addressUser = await prisma.user.update({
      where: { id: Number(req.user.id) },
      data: { address: address },
    });
    res.json({
      massage: "Save Address Success",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Server Error In Controllers/user/exports.saveAddress",
    });
  }
};

exports.saveOrder = async (req, res) => {
  try {
    // Step
    // Step 1: Get User Cart
    const Usercart = await prisma.cart.findFirst({
      where: { orderedById: Number(req.user.id) },
      include: {
        products: true,
      }, // Include products in the cart
    });

    //check cart empty
    if (!Usercart || Usercart.products.length === 0) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // check quantity
    for (const item of Usercart.products) {
      const product = await prisma.product.findFirst({
        where: { id: item.productId },
        select: { quantity: true, title: true },
      });

      if (product.quantity < item.count) {
        return res
          .status(400)
          .json({ ok: false, message: `ຂໍອະໄພ ສິນຄ້າ ${product.title} ໝົດ` });
      }
    }

    // Calculate cart total
    const cartTotal = Usercart.products.reduce((total, item) => {
      return total + item.price * item.count;
    }, 0);

    // Step 2: Create a new Order
    const order = await prisma.order.create({
      data: {
        products: {
          create: Usercart.products.map((item) => ({
            productId: item.productId,
            count: item.count,
            price: item.price,

          })),
        },
        
        orderedBy: {
          connect: {
            id: req.user.id,
          },
        },

        cartTotal: cartTotal, // Add the required cartTotal field
      },
    });

    // Step 3: Update the Product Quantity
    for (const item of Usercart.products) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.count } },
      });
    }
    // Step 4: Clear the Cart
    await prisma.productOnCart.deleteMany({
      where: {
        cart: {
          orderedById: Number(req.user.id),
        },
      },
    });
    res.json({
      ok: true, order
    });

  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Server Error In Controllers/user/exports.saveOrder" });
  }
};
exports.getOrder = async (req, res) => {
  try {
    //code
    const orders = await prisma.order.findMany({
      where: { orderedById: Number(req.user.id) },
      include: {
        products: {
          include: {
            product: true, // Include product details
          },
        },
      }, // Include products in the cart
    });
    if (!orders) {
      return res.status(404).json({ message: "Order not found" });
    }
    console.log(orders);
    // const users = await prisma.user.findMany();
    res.send("Hello from getOrder");
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ massage: "Server Error In Controllers/user/exports.getOrder" });
  }
};
