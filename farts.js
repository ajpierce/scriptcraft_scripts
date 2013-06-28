var farts = farts || plugin("farts", {
    // -- Class Variables
    maxFartStrength: 0.6,   // Max Explosive yield of a fartSplosion
    fartEvents : {
        // 2% chance to fart when changing currently held item
        "player.PlayerItemHeldEvent": 0.02,
        // 15% chance to fart when dropping an item
        "player.PlayerDropItemEvent": 0.15,
        // 2% chance to fart on chat event
        "player.PlayerChatEvent": 0.02,
        // 2% chance to fart when joining the server
        "player.PlayerJoinEvent": 0.02,
        // 20% chance to fart when consuming
        "player.PlayerItemConsumeEvent": 0.20,
        // 2% chance to fart when stepping through a portal
        "player.PlayerPortalEvent": 0.02,
        // 5% chance to fart when toggling sneak
        "player.PlayerToggleSneakEvent": 0.05,
        // 05% chance to fart when starting a sprint
        "player.PlayerToggleSprintEvent": 0.05,
        // 100% chance to fart when flying
        "player.PlayerToggleFlightEvent": 1.00,
        // 10% chance to fart on respawn
        "player.PlayerRespawnEvent": 0.10,
        // 1% chance to fart when getting exp
        "player.PlayerExpChangeEvent": 0.01,
        // 2% chance to fart when emptying or filling a bucket
        "player.PlayerBucketEmptyEvent": 0.02,
        "player.PlayerBucketFillEvent": 0.02,
        // 2% chance to fart when entering or leaving bed
        "player.PlayerBedEnterEvent": 0.02,
        "player.PlayerBedLeaveEvent": 0.02
    },

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
            0.2 : fartSplosionProbability;

        var fartSplosionChance = Math.floor(
                Math.random() / fartSplosionProbability),
            fartStrength = (Math.random() * farts.maxFartStrength),
            world = player.world;

        if (fartSplosionChance === 0){
            world.createExplosion(player.location, fartStrength);
        }

        // Notify all players that a fart has occurred
        utils.foreach(server.onlinePlayers, farts.fartAlarm, player);
        //TODO: Smoke effect
    },
    /**
    * Function that has a probability of producting a fart for the
    * given player. Also allows specification of fartSplostion
    * probability
    */
    fartChance: function(listener, event){
        var player = event.getPlayer(),
            eventName = "player." + event.getEventName(),
            percentage = farts.fartEvents[eventName],
            chance = Math.floor( Math.random() / percentage );

        if( chance === 0 ){
            farts.fart(player);
        }
    },
    incrementFart: function(player){
        farts.store.players[player.name] === 0 ?
            farts.store.players[player.name] = 1 :
            farts.store.players[player.name] += 1 ;
    },
    fartAlarm: function(player, index, farter){
        player.sendMessage(farter.name + " farted!");
    },
    smellFarts: function(farter, index, player){
        var fartCount = farts.store.players[farter] ?
            farts.store.players[farter] : 0;

        player.sendMessage(
            farter + " has farted " + fartCount + " times");
    }
}, true),
    getKeys = function(obj){
        var keys = [];
        for(var key in obj){
            keys.push(key);
        }
        return keys;
    };

farts.store.players = farts.store.players || {};

ready(function(){
    command("fart", function(params){
        farts.fart(self, 0.2);
    });
    command("sniff", function(params){
        var gassyPlayers = getKeys(farts.store.players);
        utils.foreach(gassyPlayers, farts.smellFarts, self);
    });

    // -- FART EVENTS
    var fartEvents = getKeys(farts.fartEvents);
    utils.foreach(fartEvents, function(evt){
        events.on(evt, farts.fartChance);
    });
});
