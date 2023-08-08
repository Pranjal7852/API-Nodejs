# Nimbus API

Nimbus events api

## Development

**Package Manager** pnpm -- to save disk space.. :)
**Language** NodeJs  
**Library** Express.js  
**ORM** Prisma  
**DB** Postgres

**Docs** Swagger

### up and running

- Requirements

  - NodeJs, npm -- `sudo apt install nodejs`
  - Postgres -- `sudo apt install postgresql`
    - `sudo service postgresql start`
    - let `<username>` be your username on machine as returned by `whoami`
    - `sudo -u postgres createuser -s <username>`
    - `createdb nimbus`
    - `psql nimbus`
      - `alter user <username> with password '<password>;`
      - `\q`
  - pnpm -- `sudo npm i -g pnpm`

- `pnpm install`
- create a `.env` file in project root folder and add neccessary environment variables
  ```env
  DATABASE_URL="postgresql://username:password@localhost:5432/nimbus"
  ```
- `npm start`

### dev

- **Models & DB** - `prisma/schema.prisma`

# Server Setup

> If shit doesn't work google around the solution.

- 🐟 Create a droplet (ubuntu server) from pixonoiods digitalocean account
- Get or generate ssh-key pairs to get ssh access

  > add your public key in `~/.ssh/authorized_keys` of server.

- edit the A record of `api.festnimbus.com` -> [IP.Address.Of.Server]

- ⬇️ install necessary stuff on server

  - nodejs, npm, pnpm, postgress, pm2
  - setup postgress accoount as shown above and create db nimbus

- 📂 setup folders

  - we will keep out project at `/var/www/`
  - `/var/www/nimbus-api` - Auto copied usind CI/CD github action.
  - `/var/www/static` - to host static stuff like images, data, uploads, adminer etc.

- 🆖 install and setup nginx server `sudo apt install nginx`

  - setup proxy and static server in nginx configuration `/etc/nginx/sites-available/festnimbus.com` (eg. here `./tmp/festnimbus.conf)` and link the file in `/etc/nginx/sites-enabled/festnimbus.com`
  - setup SSL certificates using `letsencrypt` and replace their path in `festnimbus.com` file above.
  - then reload server `nginx -s reload`

- [optional] setup `adminer` - a php based sql db admin panel.

  - install php-fpm `sudo apt install php7.4-fpm`
  - start service `sudo service php7.4-fpm start`
  - create directory for adminer in static folder `cd /var/www/static` , `mkdir adminer && cd adminer`,
    - paste `adminer.php->index.php` and `adminer.css` here.
      > Do this or download from their website.  
      > `curl -L https://github.com/vrana/adminer/releases/download/v4.8.1/adminer-4.8.1.php -o index.php`  
      > `curl -L https://raw.githubusercontent.com/vrana/adminer/master/designs/nette/adminer.css -o adminer.css`
    - if something doesn't work some changes have to be made to `/etc/postgresql/12/main/pg_hba.conf` file regarding login etc. google it.

- 👷‍♂️ CI/CD
  - CI/CD is automatically setup in this repo. you need to change repository secrets.
    - `USER = root`
    - `HOST = IP.Address.Of.Server`
    - `KEY = PrivateKey`
  - it automatically copy paste repository to `/var/www/nimbus-api` and then runs a script `~/deploy-api.sh` which uses pm2 to start server
  - make sure you have files `~/deploy-api.sh` and `~/ecosystem.json` on server as given here in `./tmp/`
