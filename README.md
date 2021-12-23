# Burrows Ecommerce <br/>
## Backend <br/><br/>
### Database (Sequelize & Mysql): <br/>
 - Sequelize-ORM is used for handling Mysql Database.
  - Migrations are created for All Required Models and can be run with following commands before starting with the Project:
      - npx sequelize-cli db:create **(For Creating the Database)**
      - npx sequelize-cli db:migrate **(For migration to mysql)**
      - npx sequelize-cli db:seed:all **(For running seeder script, Create Superadmin)**
      - npx sequelize-cli db:drop **(For dropping the Database)** (If required)
 - You can update config.js file inside root folder for Development and Production changes in sequelize.
 
### Endpoints: <br/>
 - After running the server with **'npm start'**, All Endpoints are available at **localhost:4000/graphql**

### Apollo-express: <br/>
 
 - Apollo express is used for handling all the Graphql Operations.
 - Base Index file contains the configuration for Apollo server.
 - Context is used for passing the Authenticated User to all the Resolvers and  resolvers contain logic for Role-Based Access. 
    e.g; Dashboard resolvers are accessible by 'Admin' or 'Superadmin' Roles.

### Authentication:<br/>
 
 - **Jwt Tokens** (Access Tokens & Refresh Tokens) are used for Auth.
 - **Access Token** is passed inside the Headers as **'Authorization token'** when accessing endpoints.
 - **Refresh Token** is preserved in Cookie and sent to Client Side and sent back  with every request through cookies.
 - It refreshes the Access Token when they are expired.
 - Once the Refresh token expires, Users are logged out.

### Rest API Endpoints:<br/>
 - Some express routes are also implemented for following functionalities:
   - Payment Gateway (Fomopay) [https://www.fomopay.com](https://www.fomopay.com)
   - Product Add, Merchant Add (Form Data containing Images Upload)
   - Following Routes are Added for Specific Reasons:
     - http://localhost:3000/api/payment
     - http://localhost:3000/api/merchant/create
     - http://localhost:3000/api/product/create 

### Cloudinary:<br/>
 - Cloudinary is used for all Images handling. Images are uploaded to cloudinary and URL is saved to Database. 
     e.g; **ProductImage** and **MerchantImage** models etc.

### Production:<br/>
 - **DigitalOcean** is handling the production for Backend.
 - **Managed Database** (Mysql) is used with **Ubuntu Droplet**.
 - pm2 is running the Node server and Server is accessible through the provided IP Address using Nginx (Already Configured).
 - You can check status with : 
    - pm2 status
    - pm2 stop src/index.js (To stop)

<br/>

## Frontend

### Apollo-client:<br/>
 
 - **Apollo-client** is handling all the graphql operations inside frontend.
 - **Queries and Mutations** are ready inside the graphql folder in root Directory.

### Dashboard:<br/>
 
 - Dashboard Frontend is finished with dummy data. Still needs interaction with Backend.
 - Following Protected Routes are implemented for Dashboard
      - localhost:3000/dashboard/admin **(Login & Register)** 
        > Note: Register only registers normal Users by default, Admin can Login and Access dashboard and other Routes.
        > Note: Admin can make Registered Users **Admin** (Backend functionality only)
      - localhost:3000/dashboard/merchants **(Show Merchants)**
      - localhost:3000/dashboard/merchant/add **(Add New merchant)**
      - localhost:3000/dashboard/merchant/:merchantId **(Show Merchant info)** 
      - localhost:3000/dashboard/merchant/:merchantId/products **(Show Merchants)**
      - localhost:3000/dashboard/merchant/:merchantId/product/add **(Add Product for merchant)**
      - localhost:3000/dashboard/customers **(Show Customers)**
      - localhost:3000/dashboard/customer/:customerid **(Show Customer Info)**
      - localhost:3000/dashboard/admin/customer/:customerid/:orderid **(Order Info)**
      - localhost:3000/dashboard/admin/merchant/:id/orders **(Show Merchant Orders)**
