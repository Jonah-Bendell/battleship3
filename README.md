[# battleship3

explaining what is working, what is in progress, and what you plan to tackle next.

Right now the system for player selection and ship randomization is working.

Right I want to actually make the hit system of stuff so the game works

Then I'll chek my plan for what's next to have done]


I built a multiplayer battleship game (https://battleship3-ye1w.onrender.com 

A description of which API endpoints you built
GET /api/join assign the player and the client and keeps it in the API
GET /api/game-state Returns the current game state including whose turn it is, all attacks made, and which players have locked their ships.
POST /api/store-ships stores the positions for ships
POST /api/lock-ships Locks in the ships so they can't be changed
POST /api/attack handles all the attacking and checks players turns, checks the hits
POST /api/reset resets the entire game and boards How you are using URL parameters and cookies URL Params: ?name=PlayerName make a display name and change it in the link cookies: battleshipClientId reset the game every 15 minutes to avoid inavtivity and clear the game regularly Wins/Losses tracker to for each client ID Which animation you added animation: added a little loading animation when waiting for turn Identify where you challenged yourself or learned things not covered in class Here I really challenged myself everywhere. First was with the ship plaicng algorithm that really combined HTML with Java script for first creating the grids Check if ships fit on the board Prevent ships from overlapping using a Set to track occupied cells Handle both horizontal and vertical orientations Creating the client ID system and giving ID's to each browser to save their data using cookies and API's creating the coordinates system and string splitting to correctly use the coordinates in the code I did a lot of research to make the API and the different endpoints because theere was so much the game required so I really challenged myself trying to make API even though I got a lot of help to get it working correctly. I really practiced logic in the code. Mixing the API with the game was really hard and using creative solutions and practicing how to use syntax to your advantage was cool to learn.)
