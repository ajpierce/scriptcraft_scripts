# scriptcraft_scripts

A collection of [ScriptCraft](https://github.com/walterhiggins/ScriptCraft/)
scripts to enhance your (or maybe just my) Minecraft experience!

## farts.js
Enhance your minecraft exeprience with farts!  This mod adds random farts to
players.  When a player farts, all members on the server will be notified, and
a cloud of fartsmoke will appear at the player's fart location.

This mod also adds a command:

+ `/jsp sniff`: The player inhales deeply, gathering a sense of the global fart 
  level. This command displays the fart leaderboard for the server.

![farts.js screenshot](http://i.imgur.com/fpnQh5v.png)

## slum.js
Extends the drone to enable quick deployment of villager slums. To promote
*breeding*.

Invoke slum generation as follows:
`/js var d = new Drone(); d.slum();`

Slum accepts 3 parameters:
+ Length: Number of hovels long the slum should be (Defaults to 7)
+ Height: Number of stories high the hovel should be (Defaults to 3)
+ Material: Material out of which to build the slum (Defaults to 5 (Oak Planks))

`/js d.slum(4,2);` builds a 4 x 2 slum, pictured below:
![slum.js screenshot](http://i.imgur.com/D1BmBdG.png)

## goldFarm.js
Add a command to build a new gold farm: a portal tree that spawns pigmen that
can be ground for their teeth.

**NOTE:** This is still a work in progress, and as of yet only contains code
to generate the portal tree, not the grinder.

Accepts 4 arguments:
+ **Length:** The number of portals wide you want the struture to be
+ **Stories:** The number of portals tall you want the structure to be
+ **Depth:** The number of portals long you want the structure to be
+ **Height:** The offset (in meters) from the ground that you wish to spawn
the portals

### Example:
`/jsp portalTree 5 2 5 10` Will construct a 5x5 grid of portals, two stories
tall, 10 meters off the ground.
