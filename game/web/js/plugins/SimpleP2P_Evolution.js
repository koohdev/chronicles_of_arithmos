/*:
 * @target MZ
 * @plugindesc [V16] Multiplayer: Full Stat Sync and Chat Alerts
 *
 * @param Sync Interval
 * @desc Frames between updates. 1 = Fastest/Smoother.
 * @type number
 * @default 1
 *
 * @param Combat Icon ID
 * @desc Icon shown when fighting (Default: 76).
 * @type number
 * @default 76
 *
 * @help
 * ============================================================================
 * SIMPLE P2P: V16 (FULL SYNC AND ALERTS)
 * ============================================================================
 * FIXES AND ADDITIONS:
 * 1. HP, MP, and TP sync live so both players see accurate stats.
 * 2. Chat messages display when a player joins a fight.
 * 3. Chat messages display when a player leaves or runs from a fight.
 * 4. Uses the actual username of the player for the chat messages.
 * 5. Auto restores the party if a player flees to keep the game stable.
 *
 * INSTRUCTIONS:
 * 1. Host: SimpleP2P.host()
 * 2. Join: SimpleP2P.join("CODE")
 * ============================================================================
 */

(() => {
    const params = PluginManager.parameters('SimpleP2P_V16');
    const SYNC_RATE = Number(params['Sync Interval']) || 1; 
    const COMBAT_ICON = Number(params['Combat Icon ID']) || 76;

    window.SimpleP2P = {
        peer: null,
        conn: null,
        myId: "",
        isConnected: false,
        isHost: false,
        originalParty: null,
        wasRemoteFighting: false,
        remoteData: {
            x: 0, y: 0, mapId: 0, 
            charName: "", charIndex: 0, 
            isFighting: false, 
            actors: [] 
        },
        
        // --- 1. CONNECTION ---
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
            
            try {
                this.peer = new Peer(null, config);
                this.peer.on('open', (id) => {
                    this.myId = id;
                    if (callback) callback(id);
                });
                this.peer.on('connection', (c) => {
                    this.setupConnection(c);
                    $gameMessage.add("Partner Connected!");
                });
                this.peer.on('error', (e) => console.warn(e));
            } catch (e) {
                console.warn("PeerJS not loaded.");
            }
        },

        host: function() {
            this.isHost = true;
            this.init((id) => {
                if (navigator.clipboard) navigator.clipboard.writeText(id);
                $gameMessage.add("Hosting! ID Copied.");
                $gameMessage.add(id);
            });
        },

        join: function(code) {
            this.isHost = false;
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
                $gameMessage.add("Partner Disconnected.");
                
                if (SceneManager._scene instanceof Scene_Battle) {
                    if (this.remoteData.isFighting) {
                        $gameMessage.add(this.remoteData.charName + " left the fight!");
                    }
                    BattleManager.processAbort(); 
                    this.restoreParty();
                    this.refreshBattleVisuals(true);
                }
                this.remoteData.isFighting = false;
                this.wasRemoteFighting = false;
            });
        },

        // --- 2. UPDATE LOOP ---
        update: function() {
            if (!$gameParty || !$gamePlayer || !$gameMap) return;
            if (!this.isConnected || !this.conn) return;

            if (Graphics.frameCount % SYNC_RATE === 0) {
                this.sendUpdate();
            }
            
            if (SceneManager._scene instanceof Scene_Map) {
                this.processGhostMovement();
            }

            // Detect if partner leaves the fight
            if (this.wasRemoteFighting && !this.remoteData.isFighting) {
                if (SceneManager._scene instanceof Scene_Battle) {
                    $gameMessage.add(this.remoteData.charName + " left the fight!");
                    this.restoreParty();
                    this.refreshBattleVisuals(true);
                }
            }
            this.wasRemoteFighting = this.remoteData.isFighting;

            // Battle Visuals Safety Check
            if (SceneManager._scene instanceof Scene_Battle) {
                if (Graphics.frameCount % 60 === 0) {
                    this.refreshBattleVisuals();
                }
            }
        },

        sendUpdate: function() {
            const leader = $gameParty.leader();
            const inBattle = (SceneManager._scene instanceof Scene_Battle);
            if (!leader) return;

            // Send full stats to fix the invisible UI bug
            const myActors = $gameParty.members().slice(0, 2).map(a => ({
                id: a.actorId(),
                hp: a.hp,
                mp: a.mp,
                tp: a.tp,
                mhp: a.mhp,
                mmp: a.mmp
            }));

            const packet = {
                type: 'state',
                mapId: $gameMap.mapId(),
                x: $gamePlayer.x,
                y: $gamePlayer.y,
                charName: leader.characterName(),
                charIndex: leader.characterIndex(),
                isFighting: inBattle,
                actors: myActors 
            };
            try { this.conn.send(packet); } catch(e) {}
        },

        handleData: function(data) {
            if (data.type === 'state') {
                this.remoteData = data;
                this.syncRemoteStats();
            }
            
            if (data.type === 'request_join') {
                if (SceneManager._scene instanceof Scene_Battle) {
                    const myActors = $gameParty.members().slice(0, 2).map(a => a.actorId());
                    this.conn.send({ 
                        type: 'accept_join', 
                        troopId: $gameTroop._troopId,
                        hostActors: myActors
                    });
                    
                    const remoteActorIds = this.remoteData.actors.map(a => a.id);
                    this.mergeParty(remoteActorIds);
                    $gameMessage.add(this.remoteData.charName + " joined the fight!");
                }
            }
            
            if (data.type === 'accept_join') {
                this.joinBattleAsClient(data.troopId, data.hostActors);
                $gameMessage.add("Joined " + this.remoteData.charName + " fight!");
            }

            if (data.type === 'battle_action') {
                this.executeRemoteAction(data);
            }
        },

        // --- 3. LIVE STAT SYNC ---
        syncRemoteStats: function() {
            if (!this.originalParty) return; 
            
            if (SceneManager._scene instanceof Scene_Battle) {
                this.remoteData.actors.forEach(rActor => {
                    const localActor = $gameActors.actor(rActor.id);
                    // Only update if it is the other players character
                    if (localActor && !this.originalParty.includes(rActor.id)) {
                        localActor._hp = rActor.hp;
                        localActor._mp = rActor.mp;
                        localActor._tp = rActor.tp;
                    }
                });
                
                if (SceneManager._scene._statusWindow) {
                    SceneManager._scene._statusWindow.refresh();
                }
            }
        },

        // --- 4. PARTY LOGIC ---
        backupParty: function() {
            this.originalParty = $gameParty._actors.slice(0, 2);
        },

        restoreParty: function() {
            if (this.originalParty) {
                $gameParty._actors = this.originalParty.slice();
                this.originalParty = null;
                $gamePlayer.refresh();
            }
        },

        mergeParty: function(remoteActorIds) {
            if (!this.originalParty) this.backupParty();
            const myActors = $gameParty._actors.slice(0, 2);
            $gameParty._actors = myActors.concat(remoteActorIds);
            
            this.refreshBattleVisuals(true); 
        },

        joinBattleAsClient: function(troopId, hostActorIds) {
            if (!this.originalParty) this.backupParty();
            const myActors = $gameParty._actors.slice(0, 2);
            $gameParty._actors = hostActorIds.concat(myActors);
            $gamePlayer.refresh();
            
            BattleManager.setup(troopId, true, true);
            BattleManager.setEventCallback(n => this._branch = n);
            $gamePlayer.makeEncounterCount();
            SceneManager.push(Scene_Battle);
            
            setTimeout(() => this.refreshBattleVisuals(true), 100);
        },

        // --- CRITICAL VISUAL FIXES ---
        refreshBattleVisuals: function(forceRebuild = false) {
            if (!(SceneManager._scene instanceof Scene_Battle)) return;
            const scene = SceneManager._scene;
            const spriteset = scene._spriteset;

            $gameParty.members().forEach(actor => {
                if (actor && actor.onBattleStart) {
                    if (actor._tpbState === undefined) actor.onBattleStart(); 
                }
            });

            if (scene._statusWindow) {
                scene._statusWindow.refresh();
            }

            if (forceRebuild && spriteset) {
                if (spriteset._actorSprites) {
                    for (const sprite of spriteset._actorSprites) {
                        if (spriteset._battleField) spriteset._battleField.removeChild(sprite);
                    }
                }
                spriteset.createActors();
            }

            if (spriteset && spriteset._actorSprites) {
                spriteset._actorSprites.forEach((sprite, index) => {
                    if (index < $gameParty.members().length) {
                        sprite.setBattler($gameParty.members()[index]);
                        if (sprite.setHome && $gameSystem.isSideView()) {
                            const x = 600 + index * 32;
                            const y = 280 + index * 48;
                            sprite.setHome(x, y);
                        }
                    }
                });
            }
        },

        // --- 5. GHOST MOVEMENT ---
        getGhostEvent: function() {
            if (!$gameMap || !$gameMap.events()) return null;
            return $gameMap.events().find(e => e.event().name === "RemotePlayer");
        },

        processGhostMovement: function() {
            const event = this.getGhostEvent();
            if (!event) return;
            const data = this.remoteData;

            if (data.mapId !== $gameMap.mapId()) {
                event.setOpacity(0);
                
                // --- NEW TETHER LOGIC ---
                // If I am NOT the host, force me to teleport to the Host's map!
                if (!this.isHost && data.mapId > 0) {
                    if (!$gamePlayer.isTransferring() && !(SceneManager._scene instanceof Scene_Battle)) {
                        console.log("Host changed maps. Tethering...");
                        $gamePlayer.reserveTransfer(data.mapId, data.x, data.y, 2, 0);
                    }
                }
                return;
            }
            event.setOpacity(255);

            if (event._characterName !== data.charName || event._characterIndex !== data.charIndex) {
                event.setImage(data.charName, data.charIndex);
            }

            const dist = $gameMap.distance(event.x, event.y, data.x, data.y);
            if (dist > 10) {
                event.setPosition(data.x, data.y);
            } else if (dist > 0) {
                if (data.isFighting) return;
                event.setMoveSpeed(dist > 3 ? 6 : (dist > 1 ? 5 : 4));
                event.moveTowardCharacter({x: data.x, y: data.y});
            }
        },

        onGhostInteract: function() {
            if (this.remoteData.isFighting) {
                $gameMessage.add("Join Fight?");
                $gameMessage.setChoices(["Yes", "No"], 0, 1);
                $gameMessage.setChoiceCallback(n => {
                    if (n === 0) {
                        this.conn.send({ type: 'request_join' });
                        $gameMessage.add("Requesting...");
                    }
                });
            } else {
                $gameMessage.add("Partner is safe.");
            }
        },

        // --- 6. ACTIONS ---
        broadcastAction: function(subject, action) {
            if (!this.isConnected) return;
            this.conn.send({
                type: 'battle_action',
                subjectIndex: subject.index(),
                isActor: subject.isActor(),
                actionId: action.item().id,
                targetIndex: action._targetIndex
            });
        },

        executeRemoteAction: function(data) {
            if (!data) return;
            let subject = null;
            if (data.isActor) {
                if ($gameParty.members().length > data.subjectIndex) {
                    subject = $gameParty.members()[data.subjectIndex];
                }
            } else {
                if ($gameTroop.members().length > data.subjectIndex) {
                    subject = $gameTroop.members()[data.subjectIndex];
                }
            }
            
            if (subject) {
                subject.forceAction(data.actionId, data.targetIndex);
                BattleManager.forceAction(subject);
            }
        }
    };

    // ======================================================================
    //  HOOKS
    // ======================================================================

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (window.SimpleP2P) SimpleP2P.update();
    };

    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update.call(this);
        if (window.SimpleP2P) SimpleP2P.update();
    };

    const _Game_Event_start = Game_Event.prototype.start;
    Game_Event.prototype.start = function() {
        if (this.event() && this.event().name === "RemotePlayer") {
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

    const _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.call(this);
        try { this.updateCombatIcon(); } catch(e) {}
    };

    Sprite_Character.prototype.updateCombatIcon = function() {
        if (!this._character) return;
        if (!(this._character instanceof Game_Event)) return; 
        if (this._character.event().name !== "RemotePlayer") return;

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

    const _BattleManager_invokeAction = BattleManager.invokeAction;
    BattleManager.invokeAction = function(subject, target) {
        _BattleManager_invokeAction.call(this, subject, target);
        if (subject && subject.isActor() && subject.index() < 2) { 
             SimpleP2P.broadcastAction(subject, this._action);
        }
    };

    const _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        _BattleManager_endBattle.call(this, result);
        SimpleP2P.restoreParty(); 
    };

})();