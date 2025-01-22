# decompil.in backend

**BunJS is required**

**Make sure you are in the backend directory when running these commands**
## Setup

1. Create a spotify developer application over on [spotify](https://developer.spotify.com/)
2. Copy `.env.example` into `.env` and fill out the fields **(ignore the token field)** **(Make sure to add your callback url to your spotify application)**
3. Start the backend (`docker compose up backend`)
4. Connect to the database using the credentials you specified earlier: `mysql -u root -h 127.0.0.1 -P 3306 -p`
   - Run this command to grant all privileges to the user, make sure to replace any placeholder values to the ones you set earlier in the env files: `GRANT ALL PRIVILEGES ON *.* TO 'USERNAME'; CREATE DATABASE database_name; exit;`
5. Run `bun install && bun drizzle-kit push` to push the database schema
6. Navigate to `http://{APP_BASE}/setup?auth=PWD_IN_ENV_FILE`
7. After authenticating with spotify you will be redirected back. To get your token you need to add the auth query parameter to your url like this:
    
    - Before: `http://{APP_BASE}/setup?code=abcd1234`
    - After: `http://{APP_BASE}/setup?code=abcd1234&auth=PWD_IN_ENV_FILE`
8. Paste the returned token into the SPOTIFY_TOKEN field in the env file
9. Stop the docker containers

10. Now continue with the guide in the root README