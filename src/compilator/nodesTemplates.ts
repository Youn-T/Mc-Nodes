export const nodes: Record<string, { template: string, dependencies?: string[], var?: Record<string, string> }> = {
    "block explode": {
        template: "world.afterEvents.blockExplode.subscribe(eventData => {\n /* __NEXT_NODE__ */ });",
        dependencies: ["world"]
    },
    "button push": {
        template: "world.afterEvents.buttonPush.subscribe(eventData => {\n /* __NEXT_NODE__ */ });",
        dependencies: ["world"]
    },
    "world get dimension": {
        template: "const /* __VAR1__ */ = world.getDimension(/* __dimension_id__ */);\n",
        dependencies: ["world"],
        var: { "dimension": "VAR1" }
    },
    "dimension get players": {
        template: "const /* __VAR1__ */ = /* __dimension__ */.getPlayers();\n",
        dependencies: ["world"],
        var: { "players": "VAR1" }
    },
    "get array element by index": {
        template: "const /* __VAR1__ */ = /* __array__ */[/* __index__ */];\n",
        var: { "element": "VAR1" }
    },
    "player send message": {
        template: "/* __player__ */.sendMessage(/* __message__ */);\n",
    }
}
