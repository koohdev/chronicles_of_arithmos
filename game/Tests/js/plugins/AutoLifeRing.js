/*:
 * @target MZ
 * @plugindesc [V1.5] Ring of Life - Damage Interception Hook
 * @author Gemini AI
 * 
 * @param Auto-Life State ID
 * @desc The ID of your Auto-Life state in the Database.
 * @type state
 * @default 15
 * 
 * @param Ring of Life Name
 * @desc The exact name of the accessory in your Database.
 * @type string
 * @default Ring of Life
 * 
 * @help
 * ============================================================================
 * RING OF LIFE PLUGIN V1.5
 * ============================================================================
 * FIX: Intercepts damage *before* it can kill the actor.
 * 
 * This method is safer for TPB (Time Progress Battle) because it prevents 
 * the actor from ever entering the "Knockout" state.
 */

(() => {
    const params = PluginManager.parameters('AutoLifeRing');
    const AUTO_LIFE_STATE_ID = Number(params['Auto-Life State ID']) || 15;
    const RING_NAME = String(params['Ring of Life Name']) || "Ring of Life";

    Game_Actor.prototype.hasRingOfLife = function() {
        return this.equips().some(item => item && item.name === RING_NAME);
    };

    const _Game_Actor_onBattleStart = Game_Actor.prototype.onBattleStart;
    Game_Actor.prototype.onBattleStart = function(advantageous) {
        _Game_Actor_onBattleStart.call(this, advantageous);
        this._autoLifeUsed = false;
        if (this.hasRingOfLife()) {
            this.addState(AUTO_LIFE_STATE_ID);
        }
    };

    const _Game_Battler_executeDamage = Game_Battler.prototype.executeDamage;
    Game_Battler.prototype.executeDamage = function(value) {
        // Only run logic if this is an actor, has the ring, hasn't used it, and damage is fatal
        if (this.isActor() && this.hasRingOfLife() && !this._autoLifeUsed && value >= this.hp) {
            
            console.log("Ring of Life: Fatal damage intercepted for " + this.name());
            
            // 1. Mark as used
            this._autoLifeUsed = true;
            
            // 2. Perform Revival (Heal to 50%)
            this.setHp(Math.floor(this.mhp * 0.5));
            
            // 3. Clean up the Auto-Life state
            this.removeState(AUTO_LIFE_STATE_ID);
            
            // 4. Play visual feedback
            this.startAnimation(41);
            if (BattleManager._logWindow) {
                BattleManager._logWindow.addText("\\C[14]" + this.name() + " was revived by the Ring of Life!\\C[0]");
            }
            
            // 5. Change damage to 0 so they don't actually die
            value = 0;
        }
        
        // Pass original (or modified) damage to engine
        _Game_Battler_executeDamage.call(this, value);
    };
})();