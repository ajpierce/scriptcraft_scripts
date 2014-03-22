/**
* goldFarm.js: Extend the drone to build a nether portal matrix to be used in
*              the spawning of Zombie Pigmen for the accumulation of gold and xp
*/

var Drone = require('../drone').Drone,
  utils = require('utils');

Drone.extend('portalCube', function(){
    var air = 0,
        obsidian = 49,  // org.bukkit.Material.OBSIDIAN;
        portal = 90,
        trapDoor = 96;
    
    this.chkpt('portalCube');

    // Start with an obsidian cube
    this.box0(obsidian, 4,5,4);
    // Clear out the middle for portal space
    this.up(1).right(1).box(air, 2,3,4).fwd(1).left(1).box(air, 4,3,2);
    this.move('portalCube');
    // Add the trapdoors to allow spawning; need to be manually opened
    this.right(1).fwd(1).box(trapDoor, 2,1,2);
    goldFarm.openAndOrientTrapdoors(this.getLocation());
    this.move('portalCube');
    // Boot up the portals!
    this.up(1).right(1).box(portal, 2,3,1).fwd(3).box(portal, 2,3,1);
    this.move('portalCube');
    this.up(1).fwd(1).box(portal, 1,3,2).right(3).box(portal, 1,3,2);
    this.move('portalCube');
    return this;
});
/**
* Checking for trap doors and opening them is so inefficient (due to the fact
* that, depending on which direction you're facing, the drone assumes that it
* is in a different place, and we can't reliably identify which blocks are the
* trap doors, adn we need to do a 3D search to locate them) that we need to
* defer the creation of cubes and rows to give the operations time to complete
* without crashing the server or kicking players off
**/
Drone.extend('portalTree', function(length, height, depth){
  console.log('length='+ length + ',height=' + height + ',depth=' + depth);
    this.chkpt('portalTree');
    var i = 0,
        j = 0,
        k = 0,
        drone = this,
        // -- Deferred tasks conditions
        nextCube = function(){ return i < length; },
        nextRow = function(){ return j < depth; },
        nextStory = function(){ return k < height; },
        // -- Functions to perform construction
        resetRow = function() { 
            i = 0;
            j++;
        },
        resetStory = function() { 
            j = 0; 
            k++;
        },
        buildCube = function(){
	    console.log('building cube: ' + i);
            drone.right(3).portalCube();
            i++;
        },
        buildRow = function() {
	    console.log('building row: ' + j);
            drone.move('portalRow').fwd(j*3);
            utils.nicely( buildCube, nextCube, resetRow, 20 );
        },
        buildStory = function(){
	    console.log('building story: ' + k);
            drone.move('portalTree').up(4*k);
            drone.chkpt('portalRow');
            utils.nicely( buildRow, nextRow, resetStory, 200 );
        };

    utils.nicely( buildStory, nextStory, undefined, 1000 );
});

var goldFarm = goldFarm || plugin("goldFarm", {
    /**
    * The fourth trapdoor will always collapse for some terrible reason :(
    * This function is inefficient but we are accommodating it above
    */
    openAndOrientTrapdoors: function(loc, rotate){
        var minX = loc.getX() - 1,
            minY = loc.getY() - 1,
            minZ = loc.getZ() - 1,
            maxX = loc.getX() + 2,
            maxY = loc.getY() + 1,
            maxZ = loc.getZ() + 2,
            // Faces to which we want the trapdoor attached, in order.
            faces = [0x1, 0x0, 0x0, 0x1], // South, North, North, South
            attachedFace = 0,
            x,y,z, block, data;

        // Orient the trapdoors and open
        for( x=minX; x<maxX; x++ ){
            for( y=minY; y<maxY; y++ ){
                for( z=minZ; z<maxZ; z++ ){
                    block = loc.world.getBlockAt(x, y, z);
                    if( block.getType() == org.bukkit.Material.TRAP_DOOR ){
                        data = block.getData();
                        data = data | faces[attachedFace % 4]; // Attach it to correct block
                        attachedFace = attachedFace + 1; // Increment attachment counter
                        data = data | 0x4;  // Open the trapdoor
                        block.setData(data);
                    }
                }
            }
        }
    },
    /**
    * Builds a portal tree that is x wide, z long, and y tall
    * height is determined by the height param
    */
    buildPortalTree: function(width, floors, depth, height, sender){
        width = (typeof width === "undefined")? 10 : parseFloat(width);
        floors = (typeof floors === "undefined")? 10 : parseFloat(floors);
        depth = (typeof depth === "undefined")? 30 : parseFloat(depth);
        height = (typeof height === "undefined")? 10 : parseFloat(height);

        var d = new Drone(sender);
        d.up(height).portalTree(width, floors, depth);
    }
});

command("portalTree", function(params, sender ) {
  goldFarm.buildPortalTree(params[0], params[1], params[2], params[3], sender);
});
command("portalCube", function(params, sender ) {
  var d = new Drone(sender);
  d.portalCube();
});

