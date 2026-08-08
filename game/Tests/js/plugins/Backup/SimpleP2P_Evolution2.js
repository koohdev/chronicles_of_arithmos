/*:
 * @target MZ
 * @plugindesc [V9] Multiplayer: Battle Sync Fix & Jitter Reduction.
 * @author Gemini AI
 *
 * @param Sync Interval
 * @desc Frames between updates. (Default: 2). Lower = Smoother.
 * @type number
 * @default 2
 *
 * @param Combat Icon ID
 * @desc Icon shown when fighting (Default: 76).
 * @type number
 * @default 76
 *
 * @help
 * ============================================================================
 * SIMPLE P2P: BATTLE FIX (V9)
 * ============================================================================
 * FIXES:
 * 1. "Can't Join Fight": Fixed by keeping the connection alive DURING battle.
 * 2. "No Icon": Fixed by forcing status updates while in combat scene.
 * 3. "Jumpy": Increased update rate to 30 FPS (Interval 2).
 * ============================================================================
 */

(() => {
    const params = PluginManager.parameters('SimpleP2P_BattleFix');
    const SYNC_RATE = Number(params['Sync Interval']) || 2;
    const COMBAT_ICON = Number(params['Combat Icon ID']) || 76;

    window.SimpleP2P = {
        peer: null,
        conn: null,
        myId: "",
        isConnected: false,
        remoteData: {
            x: 0, y: 0, mapId: 0, 
            charName: "", charIndex: 0, 
            isFighting: false, 
            actors: [] 
        },
        
        // --- CONNECTION ---
        init: function(callback) {
            if (this.peer) { if (callback) callback(this.myId); return; }
            
            const config = {
                debug: 1,
                config: {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:global.stun.twilio.com:3478' }
                    ]
                }
            };
            this.peer = new Peer(null, config);

            this.peer.on('open', (id) => {
                this.myId = id;
                console.log("My ID: " + id);
                if (callback) callback(id);
            });

            this.peer.on('connection', (c) => {
                this.setupConnection(c);
                $gameMessage.add("Partner Connected!");
            });
        },

        host: function() {
            this.init((id) => {
                if (navigator.clipboard) navigator.clipboard.writeText(id);
                $gameMessage.add("Hosting! ID Copied.");
                $gameMessage.add(id);
            });
        },

        join: function(code) {
            const target = String(code).trim();
            this.init(() => {
                const conn = this.peer.connect(target, { label: 'rpg', reliable: true });
                this.setupConnection(conn);
                $gameMessage.add("Connecting...");
            });
        },

        setupConnection: function(conn) {
            this.conn = conn;
            this.conn.on('open', () => {
                this.isConnected = true;
                this.sendUpdate();
            });
            this.conn.on('data', (data) => this.handleData(data));
            this.conn.on('close', () => {
                this.isConnected = false;
                $gameMessage.add("Connection Lost.");
            });
        },

        // --- UPDATE LOOP (HEARTBEAT) ---
        update: function() {
            if (!this.isConnected || !this.conn) return;

            // SEND: Update often to prevent "Jumpy" movement
            if (Graphics.frameCount % SYNC_RATE === 0) {
                this.sendUpdate();
            }
            
            // RECEIVE: Smooth movement logic
            this.processGhostMovement();
        },

        sendUpdate: function() {
            const leader = $gameParty.leader();
            // Check if we are in battle explicitly
            const inBattle = (SceneManager._scene instanceof Scene_Battle);
            
            const packet = {
                type: 'state',
                mapId: $gameMap.mapId(),
                x: $gamePlayer.x,
                y: $gamePlayer.y,
                charName: leader ? leader.characterName() : "",
                charIndex: leader ? leader.characterIndex() : 0,
                isFighting: inBattle, // Force this true if in Scene_Battle
                actors: $gameParty.members().map(a => a.actorId()).slice(0, 2) 
            };
            this.conn.send(packet);
        },

        handleData: function(data) {
            if (data.type === 'state') this.remoteData = data;
            
            // Battle Handshake
            if (data.type === 'request_join') {
                // If I am in battle, let them in!
                if (SceneManager._scene instanceof Scene_Battle) {
                    this.conn.send({ 
                        type: 'accept_join', 
                        troopId: $gameTroop._troopId,
                        hostActors: $gameParty.members().map(a => a.actorId()).slice(0, 2)
                    });
                    
                    // Host Logic: Remove slots 3 & 4
                    if ($gameParty.members().length > 2) $gameParty.removeActor($gameParty.members()[2].actorId());
                    if ($gameParty.members().length > 2) $gameParty.removeActor($gameParty.members()[2].actorId());
                    
                    // Add Client's Actors
                    if (this.remoteData.actors[0]) $gameParty.addActor(this.remoteData.actors[0]);
                    if (this.remoteData.actors[1]) $gameParty.addActor(this.remoteData.actors[1]);
                    
                    $gameMessage.add("Partner Joined!");
                }
            }
            if (data.type === 'accept_join') {
                this.joinBattleAsClient(data.troopId, data.hostActors);
            }
        },

        // --- MOVEMENT ---
        getGhostEvent: function() {
            return $gameMap.events().find(e => e.event().name === "RemotePlayer");
        },

        processGhostMovement: function() {
            const event = this.getGhostEvent();
            if (!event) return;

            const data = this.remoteData;

            if (data.mapId !== $gameMap.mapId()) {
                event.setOpacity(0);
                return;
            }
            event.setOpacity(255);

            if (event._characterName !== data.charName || event._characterIndex !== data.charIndex) {
                event.setImage(data.charName, data.charIndex);
            }

            // --- JITTER FIX ---
            const dist = $gameMap.distance(event.x, event.y, data.x, data.y);

            // TELEPORT THRESHOLD
            if (dist > 10) {
                event.setPosition(data.x, data.y);
                return;
            }

            // CATCH-UP SPEED
            if (dist > 0) {
                // If Fighting, DO NOT MOVE (Fixes jitter while standing still in combat)
                if (data.isFighting) return;

                if (dist > 4) event.setMoveSpeed(6);     // Super Sprint
                else if (dist > 2) event.setMoveSpeed(5); // Dash
                else event.setMoveSpeed(4);               // Walk

                event.moveTowardCharacter({x: data.x, y: data.y});
            }
        },

        // --- INTERACTION ---
        onGhostInteract: function() {
            if (this.remoteData.isFighting) {
                $gameMessage.add("Join Fight?");
                $gameMessage.setChoices(["Yes", "No"], 0, 1);
                $gameMessage.setChoiceCallback(n => {
                    if (n === 0) {
                        this.conn.send({ type: 'request_join' });
                        $gameMessage.add("Request sent...");
                    }
                });
            } else {
                $gameMessage.add("This is your partner.");
            }
        },

        joinBattleAsClient: function(troopId, hostActors) {
            const myActors = $gameParty.members().map(a => a.actorId()).slice(0, 2);
            $gameParty._actors = [...hostActors, ...myActors];
            $gamePlayer.refresh();
            BattleManager.setup(troopId, true, true);
            BattleManager.setEventCallback(n => this._branch = n);
            $gamePlayer.makeEncounterCount();
            SceneManager.push(Scene_Battle);
        }
    };

    // --- OVERRIDES ---

    // 1. Map Update (Standard)
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        SimpleP2P.update();
    };

    // 2. CRITICAL FIX: Battle Update Hook
    // This keeps the connection alive while you are fighting
    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update.call(this);
        SimpleP2P.update();
    };

    const _Game_Event_start = Game_Event.prototype.start;
    Game_Event.prototype.start = function() {
        if (this.event().name === "RemotePlayer") {
            SimpleP2P.onGhostInteract();
            return;
        }
        _Game_Event_start.call(this);
    };

    Game_Character.prototype.moveTowardCharacter = function(target) {
        const sx = this.deltaXFrom(target.x);
        const sy = this.deltaYFrom(target.y);
        if (Math.abs(sx) > Math.abs(sy)) this.moveStraight(sx > 0 ? 4 : 6);
        else if (sy !== 0) this.moveStraight(sy > 0 ? 8 : 2);
    };

    // ICON LOGIC
    const _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.call(this);
        if (this._character && this._character.event && this._character.event().name === "RemotePlayer") {
            this.updateCombatIcon();
        }
    };

    Sprite_Character.prototype.updateCombatIcon = function() {
        // Use the remoteData directly
        const isFighting = SimpleP2P.remoteData.isFighting;
        
        if (!this._combatIconSprite) {
            this._combatIconSprite = new Sprite();
            this._combatIconSprite.bitmap = ImageManager.loadSystem('IconSet');
            const pw = 32; const ph = 32;
            const sx = (COMBAT_ICON % 16) * pw;
            const sy = Math.floor(COMBAT_ICON / 16) * ph;
            this._combatIconSprite.setFrame(sx, sy, pw, ph);
            this._combatIconSprite.anchor.x = 0.5;
            this._combatIconSprite.anchor.y = 1;
            this._combatIconSprite.y = -60;
            this.addChild(this._combatIconSprite);
        }
        this._combatIconSprite.visible = isFighting;
        if (isFighting) this._combatIconSprite.y = -60 + Math.sin(Date.now() / 200) * 5;
    };
})();