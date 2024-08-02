# OnlineShoppingApp
This repo is for managing and developing an Online Shopping App requested by the class CS 4092
Install Node.js
1. Install Node.js at https://nodejs.org/en/download/prebuilt-installer/current

Backend
1. Create a postgres server
2. Setup .env to match database
3. cd into backend
4. run node installation
    npm install
5. run the server
    npm run start

Frontend
1. create new terminal to run frontend
2. cd into frontend
3. run node installation
    npm install
4. run the server
    npm run start

Database

The backend will naturally instantiate empty database tables
This is best practice to ensure concurrency with the backend. 
However, there is the SQL_Scripts.sql that will drop and create new tables. 
    - This should be used to refresh a clean database.
Additionally, the data_insertion.sql is necessary data to create an admin token, warehouses and some products with images. 

Please run the data_insertion.sql after running the backend or creating the tables with the SQL_Scripts.sql