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
    address: String
    contact: String
    email: String!
    password: String!
    blocked: Boolean
    role: String
    products: [Product!]
    merchantImages: [MerchantImages!]
  }

  type Product {
    id: Int!
    skuName: String!,
    skuTag: String,
    skuCompany: String,
    skuCategory: String,
    skuStyle: String,
    skuColor: String,
    skuprice: Float
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
    OrderId: Int!
    ProductId: Int!
    MerchantId: Int!
    clientFirstName: String
    clientLastName: String
    clientEmail: String
    clientContactInfo: String
    refCode: Int
    deliveryOption: Int
    deliveryFee: Int
    subTotal: Int!
    promoCode: Int
    promoCodeValue: Int
    deliveryAddress: String
    billingAddress: String
    paymentStatus: String
    paymentInfo: String
    status: String
  }

  type Wishlist {
    id: Int!
    user: User!
    product: Product!
  }

  type MerchantImages {
    collectionImg: String
    bannerImg: String
  }

  type ProductImages {
    mainImage: String
  }

  # Pagination return types
  type AllMerchants{
    content: [Merchant]!
    totalPages: Int!
  }

  type AllUsers{
    content: [User]!
    totalPages: Int!
  }

  type AllOrders{
    content: [OrderItem]!
    totalPages: Int!
  }

  type AllProducts{
    content: [Product]!
    totalPages: Int!
  }

  type UserInfo{
    user: User!
    totalOrders: Int!,
    pendingOrders: Int!,
  }

  # Pagination return types END HERE

  type Query {
    # Users
    allUser(size: Int, offset: Int): AllUsers!
    getUser(id: Int!): User
    getUserInfo(id: Int!): UserInfo

    # Merchants
    allMerchants(size: Int, offset: Int): AllMerchants!
    getMerchant(id: Int!): Merchant
    merchantProducts(merchantId: Int!, size: Int, offset: Int): AllProducts!
    merchantOrders(id: Int!): [OrderItem]
    merchantImages(id: Int!): [MerchantImages]

    # Products
    allProducts(size: Int, offset: Int): AllProducts!
    getProduct(id: Int!): Product
    parentProducts(type: String!, merchantId: Int!): [Product]
    productImages(id: Int!): [ProductImages]
    
    # Cart
    getCartItems(id: Int!): [Product]
    getCart(id: Int!): Cart

    # Orders
    getUserOrders(id: Int!): [OrderItem]
    getOrder(id: Int!): [OrderItem]
    allOrders: [OrderItem]
    countUserOrders(id: Int!): Int!
    countPendingOrders(id: Int!): Int!
  }

  type Mutation {

    # Auth
    register(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): ReturnToken
    makeAdmin(email: String!): User!
    generateAccessToken: ReturnToken
    merchantLogin(email: String!, password: String!): ReturnToken
    logout: Message!
    
    # User
    updateUser(name: String!, email: String!, password: String!): User!
    removeUser(id: Int!): Message!

    # Merchant
    updateMerchant(
        name: String!, 
        email: String!, 
        password: String!,
        address: String, 
        contact: String, 
        blocked: Boolean
        role: String
    ): Merchant!

    removeMerchant(id: Int!): Message!
    blockMerchant(id: Int!): Merchant!
    unblockMerchant(id: Int!): Merchant!

    removeProduct(id: Int!): Message!
    updateProduct(
      id: Int!, 
      skuName: String!, 
      skuprice: Float, 
      inWishlist: Boolean,
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
    clearCart(id: Int!): Message!
    addToCart(productId: Int!): Message!
    removeFromCart(id: Int!, productId: Int!): Message!

    #Wishlist
    addToWishlist(userId: Int!, productId: Int!): User!
    removeFromWishlist(userId: Int!, id: Int!): Int
  }

  type ProductConnection {
    cursor: String!
    hasMore: Boolean!
    products: [Product]
  }

  type ReturnToken{
    token: String!
    email: String!
    role: String!
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