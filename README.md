# HackerPunk Telegram Bot

# Installation

**NodeJS 8.x+ must be installed as a prerequisite.**

**Mysql 5.7+ must be installed as a prerequisite.**

```
$ npm install
$ npm install forever -g
```
**Create you own configuration file.**
```
$ cp ./.env-sample .env
```
**Create new database (default name) ```bot```**
```
$ mysql -uroot
mysql> CREATE DATABASE bot;
```
**Change default values for database connect in ```.env```**

***default values***

```RDS_HOSTNAME="localhost"
   RDS_USERNAME="root"
   RDS_PASSWORD=""
   RDS_PORT="3306"
   RDS_DB="bot"
   ```
*Clean sequalize history (\*not necessary if you want fresh install)*

```
$ rm -rf sequelize-*.json
```

***run migration(create tables)***

```
$ npm run db-migrate
```

***run seeds(create global map)***

```
$ npm run db-seeds
```

# Application actions in detach mode

Start application (migration and seeds will start before application start)
```
$ npm run game-start
```

Stop
```
$ npm run game-stop
```

Update
```
$ npm run game-update
```

Generate migration from models
```
$ npm run db-make-migration
```

# Debug configuration for idea ides
![Alt text](https://monosnap.com/image/wWApX4AJfOz6ROwoUtdRRqcDEusR4z.png)
# arena
