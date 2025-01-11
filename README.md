# Folder structure

| Path      | Explanation                                                                    |
| --------- | ------------------------------------------------------------------------------ |
| ./        | Serves as the root and the frontend for the project. Use `bun frontend` to run |
| ./backend | The backend of the project, written in elysiajs. Use `bun dev` to run          |
| ./dcli    | Administration cli tool written in rust, used to approve guides for example    |

Normally you won't have to care about this if you just go with the default (docker compose), but this might be worth taking a look at if you're doing everything manually

# Setup

**BunJS is required to run this!**

**Follow the instructions in the backend folder before following these instructions**

1. Install all bun packages: `bun install`
2. Make any changes necessary to the api URL in the default page file
3. You're done, deploy the app and backend in dev mode using `bun dev`

## Docker

TODO