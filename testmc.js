import { world } from '@minecraft/server';

world.afterEvents.blockExplode.subscribe(eventData => { 
    const dim59498513 = world.getDimension(/* __dimension id__ */)
    const players159499 = dim59498513.getPlayers()
    const player186186 = players159499[0]
    player186186.sendMessage("Hello, World!")
    /* __NODE__ */ });