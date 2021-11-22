const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: Int!
    name: String!
    email: String!
    role: String
    wishlists: [Wishlist!]
    orders: [Order!]
  }

  type Merchant {
    id: Int!
    name: String!
    description: String
    address1: String
    contact1: String
    contact2: String
    email: String!
    password: String!
    tier: String
    merchantProductImages: String,
    merchantMoodshotImages: String,
    merchantAdImages: String,
    blocked: Boolean
    user: User
    products: [Product!]
  }

  type Product {
    id: Int!
    skuId: String!
    skuName: String!,
    skuTag: String,
    skuCompany: String,
    skuCategory: String,
    skuStyle: String,
    skuColor: String,
    skuPrice1: Float
    skuPrice2: Float
    skuPrice3: Float
    skuPrice4: Float
    srpPrice: Float!
    promoPrice: Float
    inWishlist: Boolean
    stockQty: Int!
    merchant: Merchant!,
    orderDetails: [OrderDetail],
    cartDetails: [CartDetail]
  }

  type Cart {
    clientFirstName: String!,
    clientLastName: String!,
    clientEmail: String!,
    clientContactInfo: String,
    refCode: String,
    deliveryOption: String,
    deliveryFee: Float,
    subTotal: Float,
    promoCode: String,
    promoCodeValue: Float,
    deliveryAddress: String,
    billingAddress: String,
    paymentStatus: String,
    paymentInfo: String,
    status: String,
    user: User!,
    details: [CartDetail]
  }

  type Order {
    marchantId: Int!
    clientFirstName: String,
    clientLastName: String,
    clientEmail: String,
    clientContactInfo: String,
    refCode: String,
    deliveryOption: String,
    deliveryFee: Float,
    subTotal: Float,
    promoCode: String,
    promoCodeValue: Float,
    deliveryAddress: String,
    billingAddress: String,
    paymentStatus: String,
    paymentInfo: String,
    status: String,
    user: User!,
    details: [OrderDetail],
  }

  type CartDetail {
    qty: Int,
    clientContactInfo: String,
    cart: Cart!,
    product: Product!
  }

  type OrderDetail {
    qty: Int,
    clientContactInfo: String,
    order: Order,
    product: Product
  }

  type Wishlist {
    id: Int!,
    description: String,
    user: User!
    product: Product!
  }

  type Query {
    allUser: [User]
    getUser(id: Int!): User

    allMerchants: [Merchant!]!
    getMerchant(id: Int!): Merchant
    merchantProducts(merchantId: Int!): [Product]

    allProducts(offset: Int, limit: Int): [Product]
    getProduct(id: Int!): Product
    searchProductsPaged(pageSize: Int, merchantId: Int!, after: String): ProductConnection
    
    getCartByUser(id: Int!): Cart
    getCart(id: Int!): Cart

    getOrdersByUser(id: Int!): [Order]
    getOrder(id: Int!): Order
    allOrders: [Order]
  }

  type Mutation {

    # Auth
    register(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): ReturnToken
    
    # User
    updateUser(name: String!, email: String!, password: String!): User!
    removeUser(id: Int!): Int
    
    # Merchant
    createMerchant(
        name: String!, 
        email: String!, 
        password: String!,
        description: String, 
        address1: String, 
        contact1: String, 
        contact2: String,
        merchantProductImages: String,
        merchantMoodshotImages: String,
        merchantAdImages: String, 
        tier: String
        blocked: Boolean
      ): Merchant!

    updateMerchant(
        name: String!, 
        email: String!, 
        password: String!,
        description: String, 
        address1: String, 
        contact1: String, 
        contact2: String,
        merchantProductImages: String,
        merchantMoodshotImages: String,
        merchantAdImages: String, 
        tier: String
    ): Merchant!

    merchantLogin(email: String!, password: String!): ReturnToken
    removeMerchant(id: Int!): Int
    blockMerchant(id: Int!): Merchant!
    unblockMerchant(id: Int!): Merchant!

    # Product
    createProduct(
      skuId: String!, 
      skuName: String!,
      skuCompany: String,
      skuCategory: String,
      skuColor: String,
      skuStyle: String,
      skuTag: String, 
      skuPrice1: Float, 
      skuPrice2: Float, 
      skuPrice3: Float, 
      skuPrice4: Float, 
      srpPrice: Float!, 
      inWishlist: Boolean,
      promoPrice: Float, 
      stockQty: Int!, 
      merchantId: Int!
    ): Product!
    removeProduct(id: Int!): Int
    updateProduct(
      id: Int!, 
      skuId: String!, 
      skuName: String!, 
      skuPrice1: Float, 
      skuPrice2: Float, 
      skuPrice3: Float, 
      skuPrice4: Float, 
      inWishlist: Boolean,
      srpPrice: Float!, 
      promoPrice: Float, 
      stockQty: Int!
    ): Product!
    
    #Order
    createOrder(
      merchantId: Int, 
      clientFirstName: String!, 
      clientLastName: String!, 
      clientEmail: String!, 
      clientContactInfo: String!, 
      refCode: String!, 
      deliveryOption: String,
      deliveryFee: Float, 
      subTotal: Float, 
      promoCode: String, 
      promoCodeValue: Float, 
      deliveryAddress: String!, 
      billingAddress: String!, 
      paymentStatus: String!,
      paymentInfo: String!, 
      status: String!
    ): Order!

    addToOrder(refCode: String!, productId: Int!, qty: Int!): Order!
    updateOrderByRefCode (refCode: String!, status: String!): Order
    removeOrderByRefCode(refCode: String): Int
    
    #Cart
    createCart(
      userId: Int!, clientFirstName: String, clientLastName: String, clientEmail: String, clientContactInfo: String, deliveryOption: String,
      deliveryFee: Float, subTotal: Float, promoCode: String, promoCodeValue: Float, deliveryAddress: String, billingAddress: String, paymentInfo: String
    ): Cart!
    clearCart(userId: Int!): Int
    resetCartData: Int
    addToCart(userId: Int!, productId: Int!, qty: Int!): Cart!
    removeFromCart(userId: Int!, productId: Int!): Cart!

    #Profile
    addToWishlist(userId: Int!, productId: Int!): User!
    removeFromWishlist(userId: Int!, id: Int!): Int
    saveCartInformation(userId: Int!, clientFirstName: String, clientLastName: String,
                          clientEmail: String, clientContactInfo: String, deliveryOption: String, deliveryFee: Float, paymentInfo: String): Cart!
  }

  type ProductConnection {
    cursor: String!
    hasMore: Boolean!
    products: [Product]
  }

  type ReturnToken{
    token: String!
  }

  type UserAuthentication {
    token: String
    user: User
    merchant: Merchant
    message: String
    success: Boolean!
  }
`;

module.exports = typeDefs;