

# === CARD: IDENTITÉ & APPARENCE ===
// Regroupe tout ce qui définit qui est l'entité et à quoi elle ressemble.  
- [ ] minecraft:type_family	Catégories de familles (mob, monster, player, etc.).  
- [ ] minecraft:nameable	Permet de nommer l'entité (étiquette de nom).  
- [ ] minecraft:scale	Taille visuelle globale de l'entité.  
- [ ] minecraft:variant	Variante visuelle de base.  
- [ ] minecraft:mark_variant	Variante visuelle secondaire.  
- [ ] minecraft:skin_id	ID de texture spécifique.  
- [ ] minecraft:color	Couleur principale (ex: mouton).  
- [ ] minecraft:color2	Couleur secondaire.  


# === CARD: LOCOMOTION & NAVIGATION ===
// Définit comment l'entité se déplace, où elle peut aller et sa vitesse.
- [ ] ~~minecraft:movement	Vitesse de marche de base.~~
- [ ] ~~minecraft:movement.basic / .fly / .swim / .amphibious / .hover	Contrôles de type de mouvement.~~
- [ ] ~~minecraft:navigation.walk / .fly / .swim / .climb / .generic	Algorithmes de recherche de chemin.~~
- [ ] ~~minecraft:can_climb / minecraft:can_fly	Capacités de franchissement (murs, air).~~
- [ ] minecraft:jump.static / .dynamic	Capacité et force de saut.
- [ ] minecraft:lava_movement / minecraft:water_movement	Vitesse dans les liquides.
- [ ] minecraft:flying_speed / minecraft:friction_modifier	Ajustements fins de la vélocité.


# === CARD: STATS & SANTÉ ===
// La gestion de la vie, de la mort et des résistances.
Health	Points de vie maximum et actuels.
- [ ] minecraft:healable	Définit comment l'entité peut être soignée.
- [ ] minecraft:damage_sensor	Réactions spécifiques à certains types de dégâts.
- [ ] minecraft:fire_immune	Immunité totale au feu et à la lave.
- [ ] minecraft:knockback_resistance	Résistance au recul lors d'un coup.
- [ ] minecraft:regeneration	Récupération automatique de santé.


# === CARD: COMBAT & OFFENSIVE ===
// Tout ce qui permet à l'entité d'attaquer.
- [ ] minecraft:attack	Dégâts de mêlée et effets de statut au contact.
- [ ] Attack Damage	Valeur brute des dégâts infligés.
- [ ] minecraft:shooter	Comportement d'attaque à distance (projectiles).
- [ ] minecraft:area_attack	Dégâts de zone autour de l'entité.
- [ ] minecraft:attack_cooldown	Temps d'attente entre deux attaques.


# === CARD: CONTRÔLE & MONTURE ===
// Permet de rendre l'entité chevauchable et contrôlable par un joueur.
- [ ] minecraft:rideable	Permet d'être monté par un ou plusieurs passagers.
- [ ] minecraft:input_ground_controlled / .air_controlled	Permet le contrôle direct (WASD).
- [ ] minecraft:item_controllable	Objets nécessaires pour diriger la monture (ex: carotte sur un bâton).
- [ ] minecraft:boostable / minecraft:dash	Capacités d'accélération temporaire.
- [ ] minecraft:vertical_movement_action	Saut ou plongée pour les montures.


# === CARD: SOCIAL & APPRIVOISEMENT ===
// Interactions relationnelles avec le joueur.
- [ ] minecraft:tameable / minecraft:tamemount	Mécaniques d'apprivoisement.
- [ ] minecraft:trusting / Trust	Mécanique de confiance (non-agression).
- [ ] minecraft:bribeable	Rendre l'entité docile avec des objets.
- [ ] minecraft:interact	Menu d'interaction ou sons au clic.
- [ ] minecraft:giveable	Objets que l'on peut donner pour déclencher des événements.


# === CARD: REPRODUCTION & CROISSANCE ===
// Cycle de vie : de l'enfance à la transformation.
- [ ] minecraft:ageable / minecraft:is_baby	Gestion de la croissance et état "bébé".
- [ ] minecraft:breedable / minecraft:genetics	Reproduction et transmission des gènes.
- [ ] minecraft:transformation	Définit en quoi l'entité se transforme (ex: villageois -> zombie).
- [ ] minecraft:spawn_entity	Capacité à pondre ou générer d'autres entités.


# === CARD: INVENTAIRE & BUTIN ===
// Ce que l'entité transporte et ce qu'elle donne à sa mort.
- [ ] minecraft:inventory	Espace de stockage interne.
- [ ] minecraft:loot	Table de butin (items lâchés à la mort).
- [ ] minecraft:equipment / minecraft:equippable	Gestion des armures et outils portés.
- [ ] minecraft:trade_table / minecraft:barter	Système d'échange et de troc.
- [ ] minecraft:shareables / minecraft:item_hopper	Ramassage et partage d'objets.


# === CARD: CAPTEURS & IA ===
// Comment l'entité perçoit son environnement.
- [ ] minecraft:entity_sensor	Détection d'autres entités à proximité.
- [ ] minecraft:environment_sensor	Réaction aux changements de biome, météo, etc.
- [ ] minecraft:target_nearby_sensor	Définition des cibles prioritaires.
- [ ] minecraft:vibration_listener	Réaction aux sons et vibrations (Warden style).
- [ ] minecraft:block_sensor	Réaction aux blocs spécifiques autour.


# === CARD: PHYSIQUE & MONDE ===
// Interaction avec les blocs et la gravité.
- [ ] minecraft:physics	Affecté par la gravité et les collisions.
- [ ] minecraft:collision_box	Taille de la zone de collision physique.
- [ ] minecraft:pushable	Peut être poussé par d'autres entités/pistons.
- [ ] minecraft:buoyant	Capacité à flotter sur l'eau.
- [ ] minecraft:break_blocks / minecraft:trail	Impact direct sur le décor (casser des blocs, laisser des traces).
- [ ] minecraft:breathable	Gestion de l'apnée et de la suffocation.
