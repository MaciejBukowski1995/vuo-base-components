# Fix Food API

## Overview

The application is built on a Node.js and Express framework, leveraging MongoDB for data persistence through Mongoose ORM. It is developed with TypeScript to ensure type safety and better code structuring. The backend architecture supports API versioning, enabling seamless future updates and modifications without impacting existing functionality.

## Features

-TBD

## Getting started

To initialize DB with 1000 recipes run: "npm run populate-db -- --recipes".
If you want to use sample users and group, run it also with "--users --groups".

Example .env content:
    MONGO_URI = mongodb://root:example@localhost:27017/mydatabase?authSource=admin
    RECIPES_FILE_PATH = /Users/maciejbukowski/Documents/GitHub/vuo-base-components/ff.api/src/db/recipes.json
    USERS_FILE_PATH = /Users/maciejbukowski/Documents/GitHub/vuo-base-components/ff.api/src/db/users.json
    GROUPS_FILE_PATH = /Users/maciejbukowski/Documents/GitHub/vuo-base-components/ff.api/src/db/groups.json




### Requirements

- Node.js
- MongoDB
- npm or yarn
