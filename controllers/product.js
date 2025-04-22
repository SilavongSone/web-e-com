const prisma = require("../config/prisma");
const cloudinary = require("cloudinary").v2;

exports.create = async (req, res) => {
  try {
    // code
    const { title, description, price, quantity, categoryId, images } =
      req.body;
    // console.log(title, description, price, quantity, images)
    const product = await prisma.product.create({
      data: {
        title: title,
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
    res.status(500).json({ message: "Server error" });
  }
};

exports.list = async (req, res) => {
  try {
    // code
    const { count } = req.params;
    const products = await prisma.product.findMany({
      take: parseInt(count),
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
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
    // code
    const { title, description, price, quantity, categoryId, images } =
      req.body;
    // console.log(title, description, price, quantity, images)

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
        title: title,
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
    res.status(500).json({ message: "Server error" });
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
        },
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

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.createImages = async (req, res) => {
  try {
    //code
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `Ecom-${Date.now()}`,
      resource_type: "auto",
      folder: "Ecom",
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeImage = async (req, res) => {
  try {
    //code
    res.send("Hello Remove Images Controller");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
