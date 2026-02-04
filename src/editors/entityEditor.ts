export const minecraftComponents: Record<string, any> = {
    // ============================
    // HEALTH - Santé, résistance au feu et aux knockbacks
    // ============================
    "HEALTH": {
        "inputs": [
            { "type": "int", "name": "max_health", "default": 20 },
            { "type": "int", "name": "default_health", "default": 20 },
            { "type": "bool", "name": "fire_resistant", "default": false },
            { "type": "float", "name": "knockback_resistance", "default": 0 }
        ],
        "compile": (values: { [key: string]: any }) => {
            const components: any = {};
            components["minecraft:health"] = {
                "value": values.default_health ?? 20,
                "max": values.max_health ?? 20
            };
            if (values.fire_resistant) {
                components["minecraft:fire_immune"] = {};
            }
            if (values.knockback_resistance > 0) {
                components["minecraft:knockback_resistance"] = {
                    "value": values.knockback_resistance
                };
            }
            return components;
        },
        "parse": {
            "components": ["minecraft:health", "minecraft:fire_immune", "minecraft:knockback_resistance"],
            "parseComponent": (componentKey: string, componentData: any) => {
                switch (componentKey) {
                    case "minecraft:health":
                        return { max_health: componentData.max, default_health: componentData.value };
                    case "minecraft:fire_immune":
                        return { fire_resistant: true };
                    case "minecraft:knockback_resistance":
                        return { knockback_resistance: componentData.value };
                    default:
                        return {};
                }
            }
        }
    },

    // ============================
    // MOVEMENT - Vitesse et capacités de mouvement
    // ============================
    "MOVEMENT": {
        "inputs": [
            { "type": "float", "name": "movement_speed", "default": 0.25 },
            { "type": "float", "name": "flying_speed", "default": 0.4 },
            { "type": "float", "name": "underwater_speed", "default": 0.15 },
            { "type": "bool", "name": "can_climb", "default": false },
            { "type": "bool", "name": "can_fly", "default": false },
            { "type": "bool", "name": "floats_in_liquid", "default": false }
        ],
        "compile": (values: { [key: string]: any }) => {
            const components: any = {};
            components["minecraft:movement"] = { "value": values.movement_speed ?? 0.25 };
            if (values.can_climb) {
                components["minecraft:can_climb"] = {};
            }
            if (values.can_fly) {
                components["minecraft:can_fly"] = {};
                components["minecraft:flying_speed"] = { "value": values.flying_speed ?? 0.4 };
            }
            if (values.floats_in_liquid) {
                components["minecraft:floats_in_liquid"] = {};
            }
            if (values.underwater_speed && values.underwater_speed !== 0.15) {
                components["minecraft:underwater_movement"] = { "value": values.underwater_speed };
            }
            return components;
        },
        "parse": {
            "components": ["minecraft:movement", "minecraft:can_climb", "minecraft:can_fly", "minecraft:floats_in_liquid", "minecraft:flying_speed", "minecraft:underwater_movement"],
            "parseComponent": (componentKey: string, componentData: any) => {
                switch (componentKey) {
                    case "minecraft:movement":
                        return { movement_speed: componentData.value };
                    case "minecraft:can_climb":
                        return { can_climb: true };
                    case "minecraft:can_fly":
                        return { can_fly: true };
                    case "minecraft:floats_in_liquid":
                        return { floats_in_liquid: true };
                    case "minecraft:flying_speed":
                        return { flying_speed: componentData.value };
                    case "minecraft:underwater_movement":
                        return { underwater_speed: componentData.value };
                    default:
                        return {};
                }
            }
        }
    },

    // ============================
    // SIZE - Taille, collision et poussée
    // ============================
    "SIZE": {
        "inputs": [
            { "type": "float", "name": "collision_width", "default": 0.6 },
            { "type": "float", "name": "collision_height", "default": 1.8 },
            { "type": "float", "name": "scale", "default": 1.0 },
            { "type": "bool", "name": "is_pushable", "default": true },
            { "type": "bool", "name": "is_pushable_by_piston", "default": true }
        ],
        "compile": (values: { [key: string]: any }) => {
            const components: any = {};
            components["minecraft:collision_box"] = {
                "width": values.collision_width ?? 0.6,
                "height": values.collision_height ?? 1.8
            };
            if (values.scale !== undefined && values.scale !== 1.0) {
                components["minecraft:scale"] = { "value": values.scale };
            }
            if (values.is_pushable !== undefined || values.is_pushable_by_piston !== undefined) {
                components["minecraft:pushable"] = {
                    "is_pushable": values.is_pushable ?? true,
                    "is_pushable_by_piston": values.is_pushable_by_piston ?? true
                };
            }
            return components;
        },
        "parse": {
            "components": ["minecraft:collision_box", "minecraft:scale", "minecraft:pushable"],
            "parseComponent": (componentKey: string, componentData: any) => {
                switch (componentKey) {
                    case "minecraft:collision_box":
                        return { collision_width: componentData.width, collision_height: componentData.height };
                    case "minecraft:scale":
                        return { scale: componentData.value };
                    case "minecraft:pushable":
                        return { is_pushable: componentData.is_pushable, is_pushable_by_piston: componentData.is_pushable_by_piston };
                    default:
                        return {};
                }
            }
        }
    },

    // ============================
    // PHYSICS - Gravité et collision
    // ============================
    "PHYSICS": {
        "inputs": [
            { "type": "bool", "name": "has_gravity", "default": true },
            { "type": "bool", "name": "has_collision", "default": true },
            { "type": "bool", "name": "push_towards_closest_space", "default": false }
        ],
        "compile": (values: { [key: string]: any }) => {
            const components: any = {};
            const physicsData: any = {};
            if (values.has_gravity !== undefined && !values.has_gravity) {
                physicsData["has_gravity"] = false;
            }
            if (values.has_collision !== undefined && !values.has_collision) {
                physicsData["has_collision"] = false;
            }
            if (values.push_towards_closest_space) {
                physicsData["push_towards_closest_space"] = true;
            }
            if (Object.keys(physicsData).length > 0) {
                components["minecraft:physics"] = physicsData;
            } else {
                components["minecraft:physics"] = {};
            }
            return components;
        },
        "parse": {
            "components": ["minecraft:physics"],
            "parseComponent": (componentKey: string, componentData: any) => {
                switch (componentKey) {
                    case "minecraft:physics":
                        return {
                            has_gravity: componentData.has_gravity ?? true,
                            has_collision: componentData.has_collision ?? true,
                            push_towards_closest_space: componentData.push_towards_closest_space ?? false
                        };
                    default:
                        return {};
                }
            }
        }
    },

    // ============================
    // ATTACK - Dégâts d'attaque et effets
    // ============================
    "ATTACK": {
        "inputs": [
            { "type": "float", "name": "damage", "default": 3 },
            { "type": "string", "name": "effect_name", "default": "" },
            { "type": "float", "name": "effect_duration", "default": 0 }
        ],
        "compile": (values: { [key: string]: any }) => {
            const components: any = {};
            const attackData: any = { "damage": values.damage ?? 3 };
            if (values.effect_name && values.effect_name !== "") {
                attackData["effect_name"] = values.effect_name;
                attackData["effect_duration"] = values.effect_duration ?? 0;
            }
            components["minecraft:attack"] = attackData;
            return components;
        },
        "parse": {
            "components": ["minecraft:attack"],
            "parseComponent": (componentKey: string, componentData: any) => {
                switch (componentKey) {
                    case "minecraft:attack":
                        return {
                            damage: componentData.damage,
                            effect_name: componentData.effect_name ?? "",
                            effect_duration: componentData.effect_duration ?? 0
                        };
                    default:
                        return {};
                }
            }
        }
    },

    // ============================
    // IDENTITY - Famille, nom, variante et couleurs
    // ============================
    "IDENTITY": {
        "inputs": [
            { "type": "string", "name": "type_family", "default": "mob" },
            { "type": "bool", "name": "is_nameable", "default": true },
            { "type": "bool", "name": "always_show_name", "default": false },
            { "type": "int", "name": "variant", "default": 0 },
            { "type": "int", "name": "mark_variant", "default": 0 },
            { "type": "int", "name": "color", "default": 0 },
            { "type": "int", "name": "color2", "default": 0 }
        ],
        "compile": (values: { [key: string]: any }) => {
            const components: any = {};
            // Type family - convertir la chaîne en tableau
            if (values.type_family) {
                const families = values.type_family.split(",").map((f: string) => f.trim()).filter((f: string) => f);
                if (families.length > 0) {
                    components["minecraft:type_family"] = { "family": families };
                }
            }
            // Nameable
            if (values.is_nameable) {
                const nameableData: any = {};
                if (values.always_show_name) {
                    nameableData["always_show"] = true;
                }
                components["minecraft:nameable"] = Object.keys(nameableData).length > 0 ? nameableData : {};
            }
            // Variant
            if (values.variant !== undefined && values.variant !== 0) {
                components["minecraft:variant"] = { "value": values.variant };
            }
            // Mark variant
            if (values.mark_variant !== undefined && values.mark_variant !== 0) {
                components["minecraft:mark_variant"] = { "value": values.mark_variant };
            }
            // Color
            if (values.color !== undefined && values.color !== 0) {
                components["minecraft:color"] = { "value": values.color };
            }
            // Color2
            if (values.color2 !== undefined && values.color2 !== 0) {
                components["minecraft:color2"] = { "value": values.color2 };
            }
            return components;
        },
        "parse": {
            "components": ["minecraft:type_family", "minecraft:nameable", "minecraft:variant", "minecraft:mark_variant", "minecraft:color", "minecraft:color2"],
            "parseComponent": (componentKey: string, componentData: any) => {
                switch (componentKey) {
                    case "minecraft:type_family":
                        return { type_family: componentData.family?.join(", ") ?? "mob" };
                    case "minecraft:nameable":
                        return { is_nameable: true, always_show_name: componentData.always_show ?? false };
                    case "minecraft:variant":
                        return { variant: componentData.value };
                    case "minecraft:mark_variant":
                        return { mark_variant: componentData.value };
                    case "minecraft:color":
                        return { color: componentData.value };
                    case "minecraft:color2":
                        return { color2: componentData.value };
                    default:
                        return {};
                }
            }
        }
    },

    // ============================
    // SPAWN - Despawn et persistance
    // ============================
    "SPAWN": {
        "inputs": [
            { "type": "bool", "name": "is_persistent", "default": false },
            { "type": "bool", "name": "can_despawn", "default": true },
            { "type": "bool", "name": "despawn_from_distance", "default": true },
            { "type": "int", "name": "min_despawn_distance", "default": 32 },
            { "type": "int", "name": "max_despawn_distance", "default": 128 },
            { "type": "int", "name": "min_range_inactivity_timer", "default": 30 }
        ],
        "compile": (values: { [key: string]: any }) => {
            const components: any = {};
            if (values.is_persistent) {
                components["minecraft:persistent"] = {};
            }
            if (values.can_despawn) {
                const despawnData: any = {};
                if (values.despawn_from_distance) {
                    despawnData["despawn_from_distance"] = {
                        "min_distance": values.min_despawn_distance ?? 32,
                        "max_distance": values.max_despawn_distance ?? 128
                    };
                }
                if (values.min_range_inactivity_timer && values.min_range_inactivity_timer !== 30) {
                    despawnData["min_range_inactivity_timer"] = values.min_range_inactivity_timer;
                }
                components["minecraft:despawn"] = Object.keys(despawnData).length > 0 ? despawnData : {};
            }
            return components;
        },
        "parse": {
            "components": ["minecraft:persistent", "minecraft:despawn"],
            "parseComponent": (componentKey: string, componentData: any) => {
                switch (componentKey) {
                    case "minecraft:persistent":
                        return { is_persistent: true };
                    case "minecraft:despawn":
                        return {
                            can_despawn: true,
                            despawn_from_distance: !!componentData.despawn_from_distance,
                            min_despawn_distance: componentData.despawn_from_distance?.min_distance ?? 32,
                            max_despawn_distance: componentData.despawn_from_distance?.max_distance ?? 128,
                            min_range_inactivity_timer: componentData.min_range_inactivity_timer ?? 30
                        };
                    default:
                        return {};
                }
            }
        }
    },

    // ============================
    // BREATHING - Respiration et sensibilité au soleil
    // ============================
    "BREATHING": {
        "inputs": [
            { "type": "bool", "name": "breathes_air", "default": true },
            { "type": "bool", "name": "breathes_water", "default": false },
            { "type": "bool", "name": "breathes_lava", "default": false },
            { "type": "bool", "name": "breathes_solids", "default": false },
            { "type": "int", "name": "total_supply", "default": 15 },
            { "type": "int", "name": "suffocate_time", "default": -20 },
            { "type": "bool", "name": "generates_bubbles", "default": true },
            { "type": "bool", "name": "burns_in_daylight", "default": false }
        ],
        "compile": (values: { [key: string]: any }) => {
            const components: any = {};
            const breathableData: any = {};
            if (values.breathes_air !== undefined && !values.breathes_air) {
                breathableData["breathes_air"] = false;
            }
            if (values.breathes_water) {
                breathableData["breathes_water"] = true;
            }
            if (values.breathes_lava) {
                breathableData["breathes_lava"] = true;
            }
            if (values.breathes_solids) {
                breathableData["breathes_solids"] = true;
            }
            if (values.total_supply !== undefined && values.total_supply !== 15) {
                breathableData["total_supply"] = values.total_supply;
            }
            if (values.suffocate_time !== undefined && values.suffocate_time !== -20) {
                breathableData["suffocate_time"] = values.suffocate_time;
            }
            if (values.generates_bubbles !== undefined && !values.generates_bubbles) {
                breathableData["generates_bubbles"] = false;
            }
            if (Object.keys(breathableData).length > 0) {
                components["minecraft:breathable"] = breathableData;
            }
            if (values.burns_in_daylight) {
                components["minecraft:burns_in_daylight"] = {};
            }
            return components;
        },
        "parse": {
            "components": ["minecraft:breathable", "minecraft:burns_in_daylight"],
            "parseComponent": (componentKey: string, componentData: any) => {
                switch (componentKey) {
                    case "minecraft:breathable":
                        return {
                            breathes_air: componentData.breathes_air ?? true,
                            breathes_water: componentData.breathes_water ?? false,
                            breathes_lava: componentData.breathes_lava ?? false,
                            breathes_solids: componentData.breathes_solids ?? false,
                            total_supply: componentData.total_supply ?? 15,
                            suffocate_time: componentData.suffocate_time ?? -20,
                            generates_bubbles: componentData.generates_bubbles ?? true
                        };
                    case "minecraft:burns_in_daylight":
                        return { burns_in_daylight: true };
                    default:
                        return {};
                }
            }
        }
    },

    // ============================
    // LOOT - Table de loot et récompense d'expérience
    // ============================
    "LOOT": {
        "inputs": [
            { "type": "string", "name": "loot_table", "default": "" },
            { "type": "string", "name": "xp_on_death", "default": "query.last_hit_by_player ? 5 : 0" },
            { "type": "string", "name": "xp_on_bred", "default": "" }
        ],
        "compile": (values: { [key: string]: any }) => {
            const components: any = {};
            if (values.loot_table && values.loot_table !== "") {
                components["minecraft:loot"] = { "table": values.loot_table };
            }
            const xpData: any = {};
            if (values.xp_on_death && values.xp_on_death !== "") {
                xpData["on_death"] = values.xp_on_death;
            }
            if (values.xp_on_bred && values.xp_on_bred !== "") {
                xpData["on_bred"] = values.xp_on_bred;
            }
            if (Object.keys(xpData).length > 0) {
                components["minecraft:experience_reward"] = xpData;
            }
            return components;
        },
        "parse": {
            "components": ["minecraft:loot", "minecraft:experience_reward"],
            "parseComponent": (componentKey: string, componentData: any) => {
                switch (componentKey) {
                    case "minecraft:loot":
                        return { loot_table: componentData.table };
                    case "minecraft:experience_reward":
                        return {
                            xp_on_death: componentData.on_death ?? "",
                            xp_on_bred: componentData.on_bred ?? ""
                        };
                    default:
                        return {};
                }
            }
        }
    },

    // ============================
    // INVENTORY - Inventaire de l'entité
    // ============================
    "INVENTORY": {
        "inputs": [
            { "type": "int", "name": "inventory_size", "default": 5 },
            { "type": "string", "name": "container_type", "default": "none" },
            { "type": "bool", "name": "can_be_siphoned_from", "default": false },
            { "type": "bool", "name": "is_private", "default": false },
            { "type": "bool", "name": "restrict_to_owner", "default": false },
            { "type": "int", "name": "additional_slots_per_strength", "default": 0 }
        ],
        "compile": (values: { [key: string]: any }) => {
            const components: any = {};
            const inventoryData: any = {};
            if (values.inventory_size !== undefined && values.inventory_size !== 5) {
                inventoryData["inventory_size"] = values.inventory_size;
            }
            if (values.container_type && values.container_type !== "none") {
                inventoryData["container_type"] = values.container_type;
            }
            if (values.can_be_siphoned_from) {
                inventoryData["can_be_siphoned_from"] = true;
            }
            if (values.is_private) {
                inventoryData["private"] = true;
            }
            if (values.restrict_to_owner) {
                inventoryData["restrict_to_owner"] = true;
            }
            if (values.additional_slots_per_strength && values.additional_slots_per_strength > 0) {
                inventoryData["additional_slots_per_strength"] = values.additional_slots_per_strength;
            }
            if (Object.keys(inventoryData).length > 0) {
                components["minecraft:inventory"] = inventoryData;
            }
            return components;
        },
        "parse": {
            "components": ["minecraft:inventory"],
            "parseComponent": (componentKey: string, componentData: any) => {
                switch (componentKey) {
                    case "minecraft:inventory":
                        return {
                            inventory_size: componentData.inventory_size ?? 5,
                            container_type: componentData.container_type ?? "none",
                            can_be_siphoned_from: componentData.can_be_siphoned_from ?? false,
                            is_private: componentData.private ?? false,
                            restrict_to_owner: componentData.restrict_to_owner ?? false,
                            additional_slots_per_strength: componentData.additional_slots_per_strength ?? 0
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
    const parsedComponentGroups: Record<string, any> = {};
    Object.keys(componentGroups).forEach((componentGroupKey: string) => {
        parsedComponentGroups[componentGroupKey] = parseComponents(componentGroups[componentGroupKey]);
    })
    return parsedComponentGroups;
}
export function parseEvents(_events: Record<string, any>) {
    return {}; // STILL TO IMPLEMENT
}