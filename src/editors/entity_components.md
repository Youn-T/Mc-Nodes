

# Entity Components - MC Nodes

Ce document décrit les composants d'entité Minecraft regroupés logiquement pour l'éditeur visuel.

---

## ✅ Composants Implémentés

### HEALTH - Santé & Résistances
Composants Minecraft inclus :
- `minecraft:health` - Points de vie (value, max)
- `minecraft:fire_immune` - Immunité au feu
- `minecraft:knockback_resistance` - Résistance au recul

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| max_health | int | 20 | Points de vie maximum |
| default_health | int | 20 | Points de vie initial |
| fire_resistant | bool | false | Immunité au feu/lave |
| knockback_resistance | float | 0 | Résistance au recul (0-1) |

---

### MOVEMENT - Locomotion
Composants Minecraft inclus :
- `minecraft:movement` - Vitesse de base
- `minecraft:can_climb` - Grimpe aux échelles
- `minecraft:can_fly` - Capacité de vol
- `minecraft:floats_in_liquid` - Flotte sur les liquides
- `minecraft:flying_speed` - Vitesse de vol
- `minecraft:underwater_movement` - Vitesse sous l'eau

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| movement_speed | float | 0.25 | Vitesse de marche |
| flying_speed | float | 0.4 | Vitesse de vol |
| underwater_speed | float | 0.15 | Vitesse sous l'eau |
| can_climb | bool | false | Peut grimper |
| can_fly | bool | false | Peut voler |
| floats_in_liquid | bool | false | Flotte sur l'eau |

---

### SIZE - Taille & Collision
Composants Minecraft inclus :
- `minecraft:collision_box` - Zone de collision
- `minecraft:scale` - Échelle visuelle
- `minecraft:pushable` - Peut être poussé

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| collision_width | float | 0.6 | Largeur collision |
| collision_height | float | 1.8 | Hauteur collision |
| scale | float | 1.0 | Multiplicateur de taille |
| is_pushable | bool | true | Poussé par entités |
| is_pushable_by_piston | bool | true | Poussé par pistons |

---

### PHYSICS - Physique
Composants Minecraft inclus :
- `minecraft:physics` - Gravité et collision

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| has_gravity | bool | true | Affecté par gravité |
| has_collision | bool | true | Collision activée |
| push_towards_closest_space | bool | false | Pousse vers espace libre si coincé |

---

### ATTACK - Combat
Composants Minecraft inclus :
- `minecraft:attack` - Dégâts et effets

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| damage | float | 3 | Dégâts de mêlée |
| effect_name | string | "" | Effet de statut appliqué |
| effect_duration | float | 0 | Durée de l'effet (secondes) |

---

### IDENTITY - Identité & Apparence
Composants Minecraft inclus :
- `minecraft:type_family` - Catégories (mob, monster, etc.)
- `minecraft:nameable` - Peut être nommé
- `minecraft:variant` - Variante visuelle
- `minecraft:mark_variant` - Variante secondaire
- `minecraft:color` - Couleur principale
- `minecraft:color2` - Couleur secondaire

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| type_family | string | "mob" | Familles (séparées par virgule) |
| is_nameable | bool | true | Peut recevoir un nom |
| always_show_name | bool | false | Affiche toujours le nom |
| variant | int | 0 | ID de variante |
| mark_variant | int | 0 | ID de variante secondaire |
| color | int | 0 | Couleur principale (0-15) |
| color2 | int | 0 | Couleur secondaire (0-15) |

---

### SPAWN - Apparition & Despawn
Composants Minecraft inclus :
- `minecraft:persistent` - Ne despawn jamais
- `minecraft:despawn` - Règles de despawn

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| is_persistent | bool | false | Ne despawn pas |
| can_despawn | bool | true | Peut disparaître |
| despawn_from_distance | bool | true | Despawn par distance |
| min_despawn_distance | int | 32 | Distance min despawn |
| max_despawn_distance | int | 128 | Distance max despawn |
| min_range_inactivity_timer | int | 30 | Temps inactivité (sec) |

---

### BREATHING - Respiration
Composants Minecraft inclus :
- `minecraft:breathable` - Respiration et suffocation
- `minecraft:burns_in_daylight` - Brûle au soleil

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| breathes_air | bool | true | Respire dans l'air |
| breathes_water | bool | false | Respire sous l'eau |
| breathes_lava | bool | false | Respire dans la lave |
| breathes_solids | bool | false | Respire dans les blocs |
| total_supply | int | 15 | Réserve d'air (secondes) |
| suffocate_time | int | -20 | Temps entre dégâts |
| generates_bubbles | bool | true | Bulles visibles |
| burns_in_daylight | bool | false | Brûle au soleil |

---

### LOOT - Butin & Expérience
Composants Minecraft inclus :
- `minecraft:loot` - Table de loot
- `minecraft:experience_reward` - XP donnée

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| loot_table | string | "" | Chemin vers loot table |
| xp_on_death | string | "query.last_hit_by_player ? 5 : 0" | XP à la mort (Molang) |
| xp_on_bred | string | "" | XP à la reproduction (Molang) |

---

### INVENTORY - Inventaire
Composants Minecraft inclus :
- `minecraft:inventory` - Propriétés d'inventaire

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| inventory_size | int | 5 | Nombre de slots |
| container_type | string | "none" | Type de conteneur |
| can_be_siphoned_from | bool | false | Hoppers peuvent extraire |
| is_private | bool | false | Ne drop pas à la mort |
| restrict_to_owner | bool | false | Accès propriétaire seul |
| additional_slots_per_strength | int | 0 | Slots bonus par force |

---

## 📋 Composants à implémenter

### NAVIGATION (TODO)
- `minecraft:navigation.walk / .fly / .swim / .climb / .generic`
- `minecraft:jump.static / .dynamic`

### COMBAT AVANCÉ (TODO)
- `minecraft:shooter` - Attaque à distance
- `minecraft:area_attack` - Dégâts de zone
- `minecraft:attack_cooldown` - Cooldown

### MONTURE (TODO)
- `minecraft:rideable`
- `minecraft:input_ground_controlled`
- `minecraft:boostable`

### APPRIVOISEMENT (TODO)
- `minecraft:tameable`
- `minecraft:trusting`
- `minecraft:interact`

### REPRODUCTION (TODO)
- `minecraft:ageable`
- `minecraft:breedable`
- `minecraft:transformation`

### CAPTEURS (TODO)
- `minecraft:entity_sensor`
- `minecraft:environment_sensor`
- `minecraft:damage_sensor`

