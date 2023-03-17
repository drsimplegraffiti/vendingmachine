### Vending Machine ERD

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/zoe50fasd89hvhjg7xy0.png)


#### Description
Postman Documentation: [https://documenter.getpostman.com/view/15544476/2s93Jxs2Mj](https://documenter.getpostman.com/view/15544476/2s93Jxs2Mj)


- Roles: 
User_Role: 
  - Buyer can: buy (deposit) coins
  - Seller can : add, update and remove products

  User model:
    - username
    - password
    - deposit
    - role (buyer or seller)

  Product model:
    - amountAvailable
    - cost
    - productName
    - sellerId

Use jsonwebtoken for authentication

Endpoints:
User:
  - POST /api/auth/register
  - POST /api/auth/login

Product:
Unsecured:
  - GET /api/products
  - GET /api/products/:id
Secured: for seller who created the product
  - POST /api/products
  - PUT /api/products/:id
  - DELETE /api/products/:id

Deposit endpoint:
Secured: for buyer and buyer can deposit only 5, 10, 25, 50, 100 cents coins 
  - POST /api/deposit


Buy endpoint:
Secured: for buyer and buyer can buy only if he has enough deposit. Using product id and amount of product to buy
  - POST /api/buy/:id
  - GET api/total/money/spent


---

#### Generate resource with --no-spec

nest g resource products --no-spec
nest g controller app --no-spec
nest g service app --no-spec
yarn run test:watch

---

##### Query to get all users 
SELECT * FROM user_entity;
