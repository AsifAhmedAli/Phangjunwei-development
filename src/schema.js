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

  type Message {
    message: String!
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
    role: String
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
    type: String!
    parentId: Int
    promoPrice: Float
    inWishlist: Boolean
    disabled: Boolean
    stockQty: Int!
    merchant: Merchant!,
  }

  type Cart {
    UserId: Int!
  }

  type CartItem{
    ProductId: Int!
    CartId: Int!
    qty: Int!
    price: Float!
  }

  type Order {
    userId: Int!
  }

  type OrderItem {
    OrderId: Int!,
    ProductId: Int!,
    MerchantId: Int!,
    clientFirstName: String,
    clientLastName: String,
    clientEmail: String,
    clientContactInfo: String,
    refCode: Int,
    deliveryOption: Int,
    deliveryFee: Int,
    subTotal: Int!,
    promoCode: Int,
    promoCodeValue: Int,
    deliveryAddress: String,
    billingAddress: String,
    paymentStatus: String,
    paymentInfo: String,
    status: String,
  }

  type Wishlist {
    id: Int!,
    description: String,
    user: User!
    product: Product!
  }

  # Pagination return types
  type AllMerchants{
    content: [Merchant]!,
    totalPages: Int!
  }

  type AllUsers{
    content: [User]!,
    totalPages: Int!
  }

  type AllOrders{
    content: [OrderItem]!,
    totalPages: Int!
  }

  type AllProducts{
    content: [Product]!,
    totalPages: Int!
  }
  # Pagination return types END HERE

  type Query {
    # Users
    allUser(size: Int, offset: Int): AllUsers!
    getUser(id: Int!): User

    # Merchants
    allMerchants(size: Int, offset: Int): AllMerchants!
    getMerchant(id: Int!): Merchant
    merchantProducts(merchantId: Int!, size: Int, offset: Int): AllProducts!
    merchantOrders(id: Int!): [OrderItem]

    # Products
    allProducts(size: Int, offset: Int): AllProducts!
    getProduct(id: Int!): Product
    parentProducts(type: String!, merchantId: Int!): [Product]
    
    # Cart
    getCartItems(id: Int!): [Product]
    getCart(id: Int!): Cart

    # Orders
    getUserOrders(id: Int!): [OrderItem]
    getOrder(id: Int!): [OrderItem]
    allOrders: [OrderItem]
  }

  type Mutation {

    # Auth
    register(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): ReturnToken
    makeAdmin(email: String!): User!
    generateAccessToken: ReturnToken
    merchantLogin(email: String!, password: String!): ReturnToken
    
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
        role: String
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
        blocked: Boolean
        role: String
    ): Merchant!

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
      type: String!
      parentId: Int
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
      disabled: Boolean,
      promoPrice: Float, 
      stockQty: Int!
    ): Product!
    
    #Order
    createOrder(
      clientFirstName: String!,
      clientLastName: String!,
      clientEmail: String!,
      clientContactInfo: String!,
      refCode: Int,
      deliveryOption: String,
      deliveryFee: Float!,
      subTotal: Float!,
      promoCode: String,
      promoCodeValue: Float,
      deliveryAddress: String!,
      billingAddress: String,
      paymentStatus: String,
      paymentInfo: String,
    ): Message!

    addToOrder(refCode: String!, productId: Int!, qty: Int!): Order!
    updateOrder(id: Int!, status: String): Message!
    deleteOrder(id: Int!): Message!
    
    #Cart
    clearCart(id: Int!): Int
    addToCart(productId: Int!): Message!
    removeFromCart(id: Int!, productId: Int!): CartItem!

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