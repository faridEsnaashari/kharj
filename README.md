1. Run `npm install`
2. Request compose file from admin
3. Run `docker compose up -d`
4. Create project database named: `university-interview`
5. Fill the `.env` file
6. Run `npx sequelize-cli db:migrate` for migrations
7. Run `npx sequelize-cli db:seed:all` for seeders

8. Change `npx sequelize-cli db:seed:all` file and add default admins
9. Run `npx sequelize-cli db:seed:all`
