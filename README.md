# scriptcraft_scripts

A collection of [ScriptCraft](https://github.com/walterhiggins/ScriptCraft/)
scripts to enhance your (or maybe just my) Minecraft experience!

## farts.js
A global fart monitor. This script adds two commands to the game:

+ `/jsp fart`: The player farts, raising his or her fart level.
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
