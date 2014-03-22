var utils = require('utils'),
  _store = { 
    players: {} 
  },
  bkSound = org.bukkit.Sound;

var fartEvents = {
  // 0.2% chance to fart when changing currently held item
  "player.PlayerItemHeldEvent": 0.002,
  // 1.5% chance to fart when dropping an item
  "player.PlayerDropItemEvent": 0.015,
  // 0.2% chance to fart on chat event
  "player.PlayerChatEvent": 0.002,
  // 0.2% chance to fart when joining the server
  "player.PlayerJoinEvent": 0.002,
  // 2% chance to fart when consuming
  "player.PlayerItemConsumeEvent": 0.020,
  // 0.2% chance to fart when stepping through a portal
  "player.PlayerPortalEvent": 0.002,
  // 50% chance to fart when toggling sneak
  "player.PlayerToggleSneakEvent": 0.5,
  // 0.5% chance to fart when starting a sprint
  "player.PlayerToggleSprintEvent": 0.005,
  // 100% chance to fart when flying
  "player.PlayerToggleFlightEvent": 1.00,
  // 0.1% chance to fart on respawn
  "player.PlayerRespawnEvent": 0.010,
  // 0.1% chance to fart when getting exp
  "player.PlayerExpChangeEvent": 0.001,
  // 0.2% chance to fart when emptying or filling a bucket
  "player.PlayerBucketEmptyEvent": 0.002,
  "player.PlayerBucketFillEvent": 0.002,
  // 0.2% chance to fart when entering or leaving bed
  "player.PlayerBedEnterEvent": 0.002,
  "player.PlayerBedLeaveEvent": 0.002
};
var farts = farts || plugin("farts", {
    // -- Class Variables
    maxFartStrength: 0.6,   // Max Explosive yield of a fartSplosion

    // -- Class Functions
    /**
    * Increments the fart counter for the specified player.
    * You can specify fartSplosion probability
    */
    fart: function(player, fartSplosionProbability){
        // Increment fart counter
        farts.incrementFart(player);

        // Configure fart variables
        fartSplosionProbability = (typeof
            fartSplosionProbability === "undefined") ?
            0.05 : fartSplosionProbability;

        var fartSplosionChance = Math.floor(
                Math.random() / fartSplosionProbability),
            fartStrength = (Math.random() * farts.maxFartStrength),
            world = player.world;

        if (fartSplosionChance === 0){
            world.createExplosion(player.location, fartStrength);
        }

        // Notify all players that a fart has occurred
        utils.foreach(server.onlinePlayers, farts.fartAlarm, player);
        farts.fartCloud(player, 3);
        player.location.world.playSound(player.location, bkSound.VILLAGER_NO, 1.0, 1.4);
    },
    /**
    * Function that has a probability of producing a fart for the
    * given player. Also allows specification of fartSplostion
    * probability
    */
    fartChance: function( event ){
        var player = event.player,
            eventName = "player." + event.getEventName(),
            percentage = fartEvents[eventName],
            chance = Math.floor( Math.random() / percentage );
        if( chance === 0 ){
            farts.fart(player);
        }
    },
    /**
    * Generate a fart cloud on top of the player for X seconds
    */
    fartCloud: function(player, seconds){
        var i = 0,
            playerLoc = player.getLocation(),
            world = player.world,
            smokeEffect = function(){
                world.playEffect(playerLoc, org.bukkit.Effect.SMOKE, 10);
                i++;
            },
            hasNext = function(){ return i < (20*seconds); };

        utils.nicely( smokeEffect, hasNext, undefined, 1 );
    },
    incrementFart: function( player ){
      var name = player.name;
      var count = _store.players[name];
      if (!count){
        count = 1;
      } else {
        count++;
      }
      _store.players[name] = count;
    },
    fartAlarm: function(player, index, farter){
        player.sendMessage(farter.name + " farted!");
    },
    smellFarts: function(farter, index, player){
        var fartCount = _store.players[farter] ?
            _store.players[farter] : 0;

        player.sendMessage(
            farter + " has farted " + fartCount + " times");
    },
    store: _store
}, true),
    getKeys = function(obj){
        var keys = [];
        for(var key in obj){
            keys.push(key);
        }
        return keys;
    };


    command("fart", function(params, sender ){
        farts.fart(sender, 0.2);
    });
    command("sniff", function(params, sender ){
        var gassyPlayers = getKeys(_store.players);
        utils.foreach(gassyPlayers, farts.smellFarts, sender);
    });

    // -- FART EVENTS
    var fartEventKeys = getKeys(fartEvents);
    utils.foreach(fartEventKeys, function(eventType){
        events.on(eventType, farts.fartChance);
    });

