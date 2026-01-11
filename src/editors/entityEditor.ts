export const minecraftComponents: Record<string, any> = {
    "NAVIGATION": {
        "inputs": [
            {
                "type": "int",
                "name": "walk_speed"
            },
            {
                "type": "bool",
                "name": "can_jump"
            },
            {
                "type": "bool",
                "name": "can_swim"
            },
            {
                "type": "bool",
                "name": "can_fly"
            }
        ]
    },
    "HEALTH": {
        "inputs": [
            {
                "type": "int",
                "name": "max_health"
            },
            {
                "type": "int",
                "name": "default_health"
            },
            {
                "type": "bool",
                "name": "fire_resistant"
            },
            {
                "type": "int",
                "name": "knockback_resistance"
            }
        ],
        "compile": (values: { [key: string]: any }) => {
            const components: any = {};

            components["minecraft:health"] = {
                "value": values.default_health,
                "max": values.max_health
            };

            // Fire resistance
            if (values.fire_resistant) {
                components["minecraft:fire_immune"] = {};
            }

            // Knockback resistance
            if (values.knockback_resistance > 0) {
                components["minecraft:knockback_resistance"] = {
                    "value": values.knockback_resistance
                };
            }

            return components;
        },
        "parse": {
            "components": [
                "minecraft:health",
                "minecraft:fire_immune",
                "minecraft:knockback_resistance"
            ],
            "parseComponent": (componentKey: string, componentData: any) => {
                switch (componentKey) {
                    case "minecraft:health":
                        return {
                            max_health: componentData.max,
                            default_health: componentData.value
                        }
                    case "minecraft:fire_immune":
                        return {
                            fire_resistant: true
                        };
                    case "minecraft:knockback_resistance":
                        return {
                            knockback_resistance: componentData.value
                        };
                    default:
                        return {};
                }
            }
        }
    }
};

const headerTemplate = (formatVersion: string, identifier: string, isSpawnable: boolean, isSummonable: boolean, events?: any, componentGroups?: any, components?: any) => {
    return {
        "format_version": formatVersion,
        "minecraft:entity": {
            "description": {
                "identifier": identifier,
                "is_spawnable": isSpawnable,
                "is_summonable": isSummonable,
                "is_experimental": false
            },
            ...(components && { "components": components }),
            ...(events && { "events": events }),
            ...(componentGroups && { "component_groups": componentGroups })
        }
    }
}

export interface EntityData {
    formatVersion: string;
    identifier: string;
    isSpawnable: boolean;
    isSummonable: boolean;
    components: Record<string, any>;
    events: Record<string, any>;
    componentGroups: Record<string, any>;
}

export function compileEntity(entityData: EntityData) {

    // ============================
    // COMPONENTS
    // ============================
    let compiledComponents: Record<string, any> = {};
    Object.keys(entityData.components).forEach(componentKey => {
        const values = entityData.components[componentKey];
        const component = minecraftComponents[componentKey];
        const compiledComponent = component.compile(values);

        compiledComponents = { ...compiledComponents, ...compiledComponent };
    });

    // ============================
    // HEADER
    // ============================

    return headerTemplate(
        entityData.formatVersion,
        entityData.identifier,
        entityData.isSpawnable,
        entityData.isSummonable,
        entityData.events,
        entityData.componentGroups,
        compiledComponents
    );
}

export function parseComponents(components: Record<string, any>) {
    const parsedComponents: Record<string, any> = {};
    Object.keys(components).forEach((componentKey: string) => {
        const componentCard = Object.entries(minecraftComponents).find(([_mcComponentKey, mcComponent]) => mcComponent?.parse?.components?.includes(componentKey));
        if (componentCard) {
            if (!parsedComponents[componentCard[0]]) parsedComponents[componentCard[0]] = {};
            parsedComponents[componentCard[0]] = { ...parsedComponents[componentCard[0]], ...componentCard[1].parse.parseComponent(componentKey, components[componentKey]) }
        };

    });
    return parsedComponents; // STILL TO IMPLEMENT
}
export function parseComponentGroups(componentGroups: Record<string, any>) {
    return {}; // STILL TO IMPLEMENT
}
export function parseEvents(events: Record<string, any>) {
    return {}; // STILL TO IMPLEMENT
}