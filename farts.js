var farts = farts || plugin("farts", {
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

        player.sendMessage(farter + " has farted " + fartCount + " times");
    }
}, true);

farts.store.players = farts.store.players || {};

ready(function(){
    command("fart", function(params){
        farts.incrementFart(self);
        utils.foreach( server.onlinePlayers, farts.fartAlarm, self );
    });
    command("sniff", function(params){
        var gassyPlayers = Object.keys(farts.store.players);
        utils.foreach(gassyPlayers, farts.smellFarts, self);
    });
});
