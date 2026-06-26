export const mockCategoryList = [
  {
    id: "1",
    parentId: null,
    name: "WOMEN",
    slug: "women",
    imageUrl: "/assets/categories/women-main.jpg",
    children: [
      {
        id: "101",
        name: "Dresses",
        slug: "dresses",
        imageUrl: "/assets/categories/dresses.jpg",
      },
      {
        id: "102",
        name: "Tops",
        slug: "tops",
        imageUrl: "/assets/categories/tops.jpg",
      },
      {
        id: "103",
        name: "Bottoms",
        slug: "bottoms",
        imageUrl: "/assets/categories/bottoms.jpg",
      },
    ],
    campaigns: [
      {
        id: "camp-1",
        title: "Summer Lookbook",
        subTitle: "Breezy styles for the heat",
        linkUrl: "/campaigns/summer",
        imageUrl: "/assets/campaigns/summer-banner.jpg",
      },
      {
        id: "camp-2",
        title: "Clearance Sale",
        subTitle: "Up to 50% off",
        linkUrl: "/campaigns/clearance",
        imageUrl: "/assets/campaigns/clearance-banner.jpg",
      },
    ],
  },
  {
    id: "2",
    parentId: null,
    name: "MEN",
    slug: "men",
    imageUrl: "/assets/categories/men-main.jpg",
    children: [
      {
        id: "201",
        name: "Shirts",
        slug: "shirts",
        imageUrl: "/assets/categories/shirts.jpg",
      },
      {
        id: "202",
        name: "Pants",
        slug: "pants",
        imageUrl: "/assets/categories/pants.jpg",
      },
      {
        id: "203",
        name: "Outerwear",
        slug: "outerwear",
        imageUrl: "/assets/categories/outerwear.jpg",
      },
    ],
    campaigns: [
      {
        id: "camp-3",
        title: "New Arrivals",
        subTitle: "Fresh fits for the season",
        linkUrl: "/campaigns/new-arrivals",
        imageUrl: "/assets/campaigns/new-arrivals-banner.jpg",
      },
    ],
  },
  {
    id: "3",
    parentId: null,
    name: "ACCESSORIES",
    slug: "accessories",
    imageUrl: "/assets/categories/accessories-main.jpg",
    children: [
      {
        id: "301",
        name: "Bags",
        slug: "bags",
        imageUrl: "/assets/categories/bags.jpg",
      },
      {
        id: "302",
        name: "Jewelry",
        slug: "jewelry",
        imageUrl: "/assets/categories/jewelry.jpg",
      },
    ],
    campaigns: [], // Good for testing empty states!
  },
];

export const mockProductList = [
  {
    id: "prod-1",
    name: "Summer Floral Midi Dress",
    price: 89.99,
    discountPrice: 65.0,
    discountStartAt: "2026-06-01T00:00:00Z",
    discountEndAt: "2026-06-30T23:59:59Z",
    description: "Light, breezy, and perfect for the summer heat.",
    categoryId: "101",
    images: [
      {
        id: "img-1-a",
        color: "Red",
        imageUrl: "/assets/products/floral-dress-red.jpg",
        isPrimary: true,
      },
      {
        id: "img-1-b",
        color: "Blue",
        imageUrl: "/assets/products/floral-dress-blue.jpg",
        isPrimary: false,
      },
    ],
    variants: [
      {
        id: "var-1-sm-red",
        size: "S",
        color: "Red",
        stockQuantity: 15,
        sku: "DRS-FLR-RED-S",
      },
      {
        id: "var-1-md-red",
        size: "M",
        color: "Red",
        stockQuantity: 5,
        sku: "DRS-FLR-RED-M",
      },
      {
        id: "var-1-lg-red",
        size: "L",
        color: "Red",
        stockQuantity: 2,
        sku: "DRS-FLR-RED-L",
      },
      {
        id: "var-1-sm-blu",
        size: "S",
        color: "Blue",
        stockQuantity: 10,
        sku: "DRS-FLR-BLU-S",
      },
      {
        id: "var-1-md-blu",
        size: "M",
        color: "Blue",
        stockQuantity: 0,
        sku: "DRS-FLR-BLU-M",
      },
    ],
  },
  {
    id: "prod-2",
    name: "Evening Slip Dress",
    price: 120.0,
    description: "Elegant silk slip dress for formal occasions.",
    categoryId: "101",
    images: [
      {
        id: "img-2-a",
        color: "Black",
        imageUrl: "/assets/products/slip-dress-black.jpg",
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: "var-2-sm-blk",
        size: "S",
        color: "Black",
        stockQuantity: 8,
        sku: "DRS-SLP-BLK-S",
      },
      {
        id: "var-2-md-blk",
        size: "M",
        color: "Black",
        stockQuantity: 12,
        sku: "DRS-SLP-BLK-M",
      },
    ],
  },

  {
    id: "prod-3",
    name: "Ribbed Knit Tank Top",
    price: 24.99,
    description: "Essential basic tank for everyday layering.",
    categoryId: "102",
    images: [
      {
        id: "img-3-a",
        color: "White",
        imageUrl: "/assets/products/knit-tank-white.jpg",
        isPrimary: true,
      },
      {
        id: "img-3-b",
        color: "Olive",
        imageUrl: "/assets/products/knit-tank-olive.jpg",
        isPrimary: false,
      },
    ],
    variants: [
      {
        id: "var-3-sm-wht",
        size: "S",
        color: "White",
        stockQuantity: 20,
        sku: "TNK-RIB-WHT-S",
      },
      {
        id: "var-3-md-wht",
        size: "M",
        color: "White",
        stockQuantity: 25,
        sku: "TNK-RIB-WHT-M",
      },
      {
        id: "var-3-lg-wht",
        size: "L",
        color: "White",
        stockQuantity: 18,
        sku: "TNK-RIB-WHT-L",
      },
      {
        id: "var-3-md-olv",
        size: "M",
        color: "Olive",
        stockQuantity: 10,
        sku: "TNK-RIB-OLV-M",
      },
    ],
  },

  {
    id: "prod-4",
    name: "Classic Oxford Shirt",
    price: 49.99,
    description:
      "A timeless, comfortable cotton shirt perfect for everyday wear.",
    categoryId: "201",
    images: [
      {
        id: "img-4-a",
        color: "Light Blue",
        imageUrl: "/assets/products/oxford-shirt-blue.jpg",
        isPrimary: true,
      },
    ],
    variants: [
      {
        id: "var-4-md-blu",
        size: "M",
        color: "Light Blue",
        stockQuantity: 30,
        sku: "SHT-OXF-BLU-M",
      },
      {
        id: "var-4-lg-blu",
        size: "L",
        color: "Light Blue",
        stockQuantity: 22,
        sku: "SHT-OXF-BLU-L",
      },
      {
        id: "var-4-xl-blu",
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