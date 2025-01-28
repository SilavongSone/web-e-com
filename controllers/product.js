const prisma = require("../config/prisma");
exports.create = async (req, res) => {
  try {
    // code
    const { name, description, price, quantity, categoryId, images } = req.body;
    // console.log(title, description, price, quantity, images)
    const product = await prisma.product.create({
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });
    res.send(product);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Server Error In Controllers/Create Product" });
  }
};

exports.list = async (req, res) => {
  try {
    //code
    const { count } = req.params;
    const products = await prisma.product.findMany({
      take: parseInt(count),
      orderBy: { created: "desc" },
      include: {
        category: true,
        images: true,
      },
    });

    res.send(products);
  } catch (err) {
    //err
    console.log(err);
    res
      .status(500)
      .json({ massage: "Server Error In Controllers/List Product" });
  }
};
exports.read = async (req, res) => {
  try {
    //code
    const { count } = req.params;
    const products = await prisma.product.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        category: true,
        images: true,
      },
    });

    res.send(products);
  } catch (err) {
    //err
    console.log(err);
    res
      .status(500)
      .json({ massage: "Server Error In Controllers/List Product" });
  }
};
exports.update = async (req, res) => {
  try {
    //code
    const { id } = req.params;
    const { name, description, price, quantity, categoryId, images } = req.body;

    // clear images
    await prisma.image.deleteMany({
      where: {
        productId: Number(req.params.id),
      },
    });

    const product = await prisma.product.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: name,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });
    res.send(product);

    // res.send("Hello Update Product Controller");
  } catch (err) {
    //err
    console.log(err);
    res
      .status(500)
      .json({ massage: "Server Error In Controllers/Update Product" });
  }
};
exports.remove = async (req, res) => {
  try {
    //code
    const { id } = req.params;
    await prisma.product.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.send("Product Deleted");
  } catch (err) {
    //err
    console.log(err);
    res
      .status(500)
      .json({ massage: "Server Error In Controllers/Remove Product" });
  }
};
exports.listBy = async (req, res) => {
  try {
    //code
    const { sort, order, limit } = req.body;
    console.log(sort, order, limit);
    const product = await prisma.product.findMany({
      take: limit,
      orderBy: { [sort]: order },
      include: {
        category: true,
      },
    });
    res.send(product);
  } catch (err) {
    //err
    console.log(err);
    res
      .status(500)
      .json({ massage: "Server Error In Controllers/ListBy Product" });
  }
};

const handdleQuery = async (req, res, query) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
        ],
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ massage: "Server Error In Controllers/Search Product" });
  }
};
const handdleprice = async (req, res, priceRang) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            price: {
              gte: priceRang[0],
              lte: priceRang[1],
            },
          },
        ],
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ massage: "Server Error In Controllers/Search Product" });
  }
};

const handdleCategory = async (req, res, categoryId) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: {
          in: categoryId.map((id) => Number(id)),
        }
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ massage: "Server Error In Controllers/Search Product" });
  }
};

exports.searchFilters = async (req, res) => {
  try {
    //code
    const { query, price, category } = req.body;

    if (query) {
      console.log("query -->", query);
      await handdleQuery(req, res, query);
    }
    if (price) {
      console.log("price -->", price);
      await handdleprice(req, res, price);
    }
    if (category) {
      console.log("category -->", category);
      await handdleCategory(req, res, category);
    }

    // res.send("Hello Search Product Controller");
  } catch (err) {
    //err
    console.log(err);
    res
      .status(500)
      .json({ massage: "Server Error In Controllers/Search Product" });
  }
};
