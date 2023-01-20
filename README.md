# House of Games API

## Hosted Version
https://gameview.onrender.com

## Background

The API is built for the purpose of storing, accessing, and editing a PSQL database of board game reviews. The intention here is to mimic the building of a real world backend service (such as reddit), which should then provide this information to the front end architecture.

To interact with the API, the user can implement HTTP requests in the browser or using software bundles, e.g. insomnia.


## Repository Instructions

- [ ] Obtain the GitHub repo code link.
- [ ] Open terminal and navigate to desired directory.
- [ ] Run the `git clone` command and paste the link obtained previously.
- [ ] In the cloned repo, run `npm i` to install all required dependencies.

## Notes
In order to successfully connect to the two databases and run the project locally, the developer will need to create an _.env.development_ and an _.env.test_ file and write a line referring to the database e.g. 
```
PGDATABASE=nc_games
```

## Setup
First create the databases
```
npm run setup-dbs
```

Then run seed
```
npm run seed
```
