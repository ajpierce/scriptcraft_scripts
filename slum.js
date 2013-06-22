/**
* slum.js: Extend the drone to build a village slum for rapid villager spawning
*/
load('../drone/drone.js');

// -- Slum subcomponent; a villager cell
Drone.extend('hovel', function(material){
    // If material is not specified, default to oak planks
    material = (typeof material === "undefined") ? 5 : material;

    this.chkpt('hovel');
    this.box(material, 3, 3, 3); // 3x3x5 prism

    // Hollow out the middle and place doors
    this.right(1).box(0,1,2,4).door().fwd(3).door();
    this.move('hovel');
    // Add upper lip
    this.up(2).back(1).left(1).box(material,5,1,5);
    this.move('hovel');
    // Fences along the outside (safety first!)
    this.up(3).back(2).box(85,3,1,1).fwd(6).box(85,3,1,1);
    this.move('hovel');
    // Add some torches for a touch of class
    this.back(1).up(1).box(50,1,1,1).right(2).box(50,1,1,1);
    this.move('hovel');
});

// -- Builds the slum out of many hovels. Defaults to 7x3 (oak)
Drone.extend('slum', function(length, height, material){
    // -- Default Variable definition
    length = (typeof length === "undefined") ? 7 : length;
    height = (typeof height === "undefined") ? 3 : height;
    material = (typeof material === "undefined") ? 5 : material;
    if (length < 1 || height < 1) {
        throw new java.lang.RuntimeException("Slums must have a positive length and height");
    }
    
    this.chkpt('slum');
    
    // Generate the row of [length] hovels for every [height]
    for (var j=0; j<height; j++){
        this.move('slum');
        this.up(3*j);
        for (var i=0; i<length; i++){
            this.hovel(material).right(2);
        }
    }
});
