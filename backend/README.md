# decompil.in backend

**BunJS is required to run this!**

## Setup
 
1. Install all bun packages: `bun install`
2. Create a spotify developer application over on [spotify](https://developer.spotify.com/)
3. Copy `.env.example` into `.env` and fill out the fields **(ignore the token field)** **(Make sure to add your callback url to your spotify application)**
4. Start the backend (`bun dev`) and navigate to http://localhost:3000/setup?auth=PWD_IN_ENV_FILE
5. After authenticating with spotify you will be redirected back. To get your token you need to add the auth query parameter to your url like this:
    
    - Before: `http://localhost:3000/setup?code=abcd1234`
    - After: `http://localhost:3000/setup?code=abcd1234&auth=PWD_IN_ENV_FILE`
6. Paste the returned token into the SPOTIFY_TOKEN field in the env file

7. You're done!