# Decompil.in

Decompil.in is my private portfolio website, also known as ***The Homepage of Spamix**! 

The website features a bit about who I am, what I do, my projects and of course a cool design! 

Ever felt the need to know what I am listening to right now? Well my website has got you covered with live theme updates based on the cover art of the song I am playing! 

Want this data for yourself directly? Go check out the [API Documentation](https://api.decompil.in/swagger)!

If you somehow get bored by all of this you can visit the inbuilt `Competitive CTF Site` and practice your badass cybersecurity skills while achieving a leaderboard rank you can flex off to all of your friends! 

You can find the site by either clicking the giffel on the homepage, or by heading over to [https://decompil.in/ctf](https://decompil.in/ctf)!

*PS: You log in through GitHub :D* 

So, that's my homepage! Want to host it for yourself? Check the instructions down below!

# Folder structure

| Path      | Explanation                                                                    |
| --------- | ------------------------------------------------------------------------------ |
| ./        | Serves as the root and the frontend for the project. Use `bun frontend` to run |
| ./backend | The backend of the project, written in elysiajs. Use `bun dev` to run          |
| ./dcli    | Administration cli tool written in rust, used to approve guides for example    |

Normally you won't have to care about this if you just go with the default (docker compose), but this might be worth taking a look at if you're doing everything manually

# Setup

At the moment the only officially supported way of hosting this website is through `docker compose`

1. Install `docker` and `docker compose` from their website or your package manager
2. Fill out all env files:
   1. Copy `.db.env.example` into `.db.env` and fill out all the values
   2. Copy `.env.example` into `.env` and fill out all the values
   3. Copy `backend/.env.example` into `backend/.env` and fill out all the necessary values 
3. Set up the backend by following the instructions specified in [the backend README](backend/README.md)
4. Change any VIRTUAL_HOST variables to reflect your domains in `docker-compose.yml`
5. Build all images and start the stack: `docker compose up -d --build
6. You're done!