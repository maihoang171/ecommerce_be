export const mockCategoryList = [
  {
    id: 1,
    parentId: null,
    name: "WOMEN",
    slug: "women",
    imageUrl: "/assets/categories/women-main.jpg",
    children: [
      {
        id: 101,
        name: "Dresses",
        slug: "dresses",
        imageUrl: "/assets/categories/dresses.jpg",
      },
      {
        id: 102,
        name: "Tops",
        slug: "tops",
        imageUrl: "/assets/categories/tops.jpg",
      },
      {
        id: 103,
        name: "Bottoms",
        slug: "bottoms",
        imageUrl: "/assets/categories/bottoms.jpg",
      },
    ],
    campaigns: [
      {
        id: 1,
        title: "Summer Lookbook",
        subTitle: "Breezy styles for the heat",
        linkUrl: "/campaigns/summer",
        imageUrl: "/assets/campaigns/summer-banner.jpg",
      },
      {
        id: 2,
        title: "Clearance Sale",
        subTitle: "Up to 50% off",
        linkUrl: "/campaigns/clearance",
        imageUrl: "/assets/campaigns/clearance-banner.jpg",
      },
    ],
  },
  {
    id: 2,
    parentId: null,
    name: "MEN",
    slug: "men",
    imageUrl: "/assets/categories/men-main.jpg",
    children: [
      {
        id: 201,
        name: "Shirts",
        slug: "shirts",
        imageUrl: "/assets/categories/shirts.jpg",
      },
      {
        id: 202,
        name: "Pants",
        slug: "pants",
        imageUrl: "/assets/categories/pants.jpg",
      },
      {
        id: 203,
        name: "Outerwear",
        slug: "outerwear",
        imageUrl: "/assets/categories/outerwear.jpg",
      },
    ],
    campaigns: [
      {
        id: 3,
        title: "New Arrivals",
        subTitle: "Fresh fits for the season",
        linkUrl: "/campaigns/new-arrivals",
        imageUrl: "/assets/campaigns/new-arrivals-banner.jpg",
      },
    ],
  },
  {
    id: 3,
    parentId: null,
    name: "ACCESSORIES",
    slug: "accessories",
    imageUrl: "/assets/categories/accessories-main.jpg",
    children: [
      {
        id: 301,
        name: "Bags",
        slug: "bags",
        imageUrl: "/assets/categories/bags.jpg",
      },
      {
        id: 302,
        name: "Jewelry",
        slug: "jewelry",
        imageUrl: "/assets/categories/jewelry.jpg",
      },
    ],
    campaigns: [],
  },
];

export const mockProductList = [
  {
    id: 1,
    name: "Summer Floral Midi Dress",
    price: 89.99,
    discountPrice: 65.0,
    discountStartAt: "2026-06-01T00:00:00Z",
    discountEndAt: "2026-06-30T23:59:59Z",
    description: "Light, breezy, and perfect for the summer heat.",
    categoryId: 101,
    images: [
      {
        id: 1,
        color: "Red",
        imageUrl: "/assets/products/floral-dress-red.jpg",
        isPrimary: true,
      },
      {
        id: 2,
        color: "Blue",
        imageUrl: "/assets/products/floral-dress-blue.jpg",
        isPrimary: false,
      },
    ],
    variants: [
      {
        id: 1,
        size: "S",
        color: "Red",
        stockQuantity: 1,
        sku: "DRS-FLR-RED-S",
      },
      {
        id: 2,
        size: "M",
        color: "Red",
        stockQuantity: 5,
        sku: "DRS-FLR-RED-M",
      },
      {
        id: 3,
        size: "L",
        color: "Red",
        stockQuantity: 2,
        sku: "DRS-FLR-RED-L",
      },
      {
        id: 4,
        size: "S",
        color: "Blue",
        stockQuantity: 10,
        sku: "DRS-FLR-BLU-S",
      },
      {
        id: 5,
        size: "M",
        color: "Blue",
        stockQuantity: 0,
        sku: "DRS-FLR-BLU-M",
      },
    ],
  },
  {
    id: 2,
    name: "Evening Slip Dress",
    price: 120.0,
    description: "Elegant silk slip dress for formal occasions.",
    categoryId: 101,
    images: [
      {
        id: 3,
        color: "Black",
        imageUrl: "/assets/products/slip-dress-black.jpg",
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: 6,
        size: "S",
        color: "Black",
        stockQuantity: 8,
        sku: "DRS-SLP-BLK-S",
      },
      {
        id: 7,
        size: "M",
        color: "Black",
        stockQuantity: 12,
        sku: "DRS-SLP-BLK-M",
      },
    ],
  },
  {
    id: 3,
    name: "Ribbed Knit Tank Top",
    price: 24.99,
    description: "Essential basic tank for everyday layering.",
    categoryId: 102,
    images: [
      {
        id: 4,
        color: "White",
        imageUrl: "/assets/products/knit-tank-white.jpg",
        isPrimary: true,
      },
      {
        id: 5,
        color: "Olive",
        imageUrl: "/assets/products/knit-tank-olive.jpg",
        isPrimary: false,
      },
    ],
    variants: [
      {
        id: 8,
        size: "S",
        color: "White",
        stockQuantity: 20,
        sku: "TNK-RIB-WHT-S",
      },
      {
        id: 9,
        size: "M",
        color: "White",
        stockQuantity: 25,
        sku: "TNK-RIB-WHT-M",
      },
      {
        id: 10,
        size: "L",
        color: "White",
        stockQuantity: 18,
        sku: "TNK-RIB-WHT-L",
      },
      {
        id: 11,
        size: "M",
        color: "Olive",
        stockQuantity: 10,
        sku: "TNK-RIB-OLV-M",
      },
    ],
  },
  {
    id: 4,
    name: "Classic Oxford Shirt",
    price: 49.99,
    description:
      "A timeless, comfortable cotton shirt perfect for everyday wear.",
    categoryId: 201,
    images: [
      {
        id: 6,
        color: "Light Blue",
        imageUrl: "/assets/products/oxford-shirt-blue.jpg",
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: 12,
        size: "M",
        color: "Light Blue",
        stockQuantity: 30,
        sku: "SHT-OXF-BLU-M",
      },
      {
        id: 13,
        size: "L",
        color: "Light Blue",
        stockQuantity: 22,
        sku: "SHT-OXF-BLU-L",
      },
      {
        id: 14,
        size: "XL",
        color: "Light Blue",
        stockQuantity: 15,
        sku: "SHT-OXF-BLU-XL",
      },
    ],
  },
];

export const mockValidUserDataInput = {
  username: "user1",
  password: "User1234@",
};

export const mockUserData = {
  id: 1,
  username: mockValidUserDataInput.username,
  isAdmin: false,
};

export const mockCartItems = [
  {
    id: 1,
    cartId: 1,
    productVariantId: 1,
    quantity: 1,
  },
  {
    id: 2,
    cartId: 1,
    productVariantId: 2,
    quantity: 3,
  },
];

export const mockCart = {
  id: 1,
  userId: mockUserData.id,
  createdAt: new Date(),
  updatedAt: new Date(),
  items: mockCartItems,
};