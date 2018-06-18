# Node Todo API

As developers, we want to be able to setup a brand new API while keeping the high quality standards. Therefore, we need an API boilerplate to start from for whenever we need to build a API. The boilerplate will use all technologies that are currently in use or going to be used on the imbrex-api project. The end goal is to have a skeleton API that can be used to get the ball rounding on a new design or aid testing separate from the main source code. With that said the boilerplate has the following requirements.

- Mysql and Sequelize
- Unit testing
- Recommended design patterns
- Pre-built routes
- User management
- Token JWT Auth
- Having a relational database
- DB Migrations

# Prerequisites

First, you need to install and run MySQL.

If you are on a Mac, we recommend using Homebrew. You can also install it directly from the source by going to [MySQL Downloads](https://dev.mysql.com/downloads/mysql/) to download the
MySQL Community Server.

Install MySQL using Homebrew:

1. If you don't already have it, install Homebrew - https://brew.sh/
2. Next, go to your terminal and install mysql `brew install mysql`
3. Then you can start up the mysql server with `brew services start mysql`
4. Verify that the mysql server is up and running with this command `mysql -uroot` (this will open the mysql repl)
5. You should see mysql's welcome prompt - "Welcome to the MySQL monitor..." If you do, then you are logged in using root (without a password) and mysql is up and running.
6. Use the command `exit` to return to your terminal session.
7. Next we need to set your mysqladmin root password to "root" (that's our current default). So, in your terminal, enter the command `mysqladmin -u root password 'root'`
8. Now let's re-enter the mysql repl - `mysql -u root -p`
9. You should be prompted for a password, so type in `root`
10. The last thing we need to do is create our database. So, within the mysql repl, type the command `SHOW DATABASES;` (this will show mysql's four inherent databses, let's not mess with them).
11. Now let's create a new database by running the command `CREATE DATABASE todo;` , `CREATE DATABASE todo_test;`, `CREATE DATABASE todo_production;`
12. Use `SHOW DATABASES;` again, to verify that the new "imbrex" database exists. If it does, then you are ready to seed.

We use Yarn to manage dependencies and run scripts.

First, you need to make sure that you have Yarn installed on your system:

```
yarn --version
```

If you don't have Yarn installed, you will need to install it. Now, there are a growing number of 
different ways to install Yarn, but we recommend that you install it through the Homebrew package 
manager. This will also install Node.js if it is not already installed:

```
brew install yarn
```

If you use nvm or similar, you should exclude installing Node.js so that nvm's version of Node.js 
is used:

```
brew install yarn --without-node
```

Once you are done make sure the configs.json in ```server/config``` represent your local env.

# Running

```
yarn install
export NODE_ENV=development && node_modules/.bin/sequelize db:migrate
yarn start
```

# Running the tests

```
yarn pre_test
yarn test
yarn post_test
```