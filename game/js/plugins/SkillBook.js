/*:
 * @target MZ
 * @plugindesc Skill Book Logic
 */
var SimpleSkillBook = SimpleSkillBook || {};

SimpleSkillBook.grant = function() {
    let actor = $gameActors.actor($gameParty._menuActorId);
    if (!actor) return;

    let skills = {
        swordsman: { 25: 175, 50: 184, 75: 185, 90: 186 },
        sorcerer:  { 25: 194, 50: 195, 75: 198, 90: 203 },
        priest:    { 25: 207, 50: 214, 75: 213, 90: 220 },
        knight:    { 25: 228, 50: 233, 75: 236, 90: 237 },
        martial:   { 25: 246, 50: 250, 75: 253, 90: 254 },
        magicsw:   { 25: 262, 50: 268, 75: 266, 90: 271 },
        hunter:    { 25: 281, 50: 285, 75: 278, 90: 288 },
        bandit:    { 25: 297, 50: 301, 75: 300, 90: 305 }
    };

    let classKey = "";
    switch(actor._classId) {
        case 1: classKey = "swordsman"; break;
        case 2: classKey = "sorcerer"; break;
        case 3: classKey = "priest"; break;
        case 4: classKey = "knight"; break;
        case 5: classKey = "martial"; break;
        case 6: classKey = "magicsw"; break;
        case 7: classKey = "hunter"; break;
        case 8: classKey = "bandit"; break;
    }

    if (classKey !== "" && skills[classKey]) {
        let learnedCount = 0;
        let classSkills = skills[classKey];
        
        for (let tier in classSkills) {
            if (actor.level >= parseInt(tier)) {
                let skillId = classSkills[tier];
                if (!actor.hasSkill(skillId)) {
                    actor.learnSkill(skillId);
                    $gameMessage.add(actor.name() + " learned " + $dataSkills[skillId].name + "!");
                    learnedCount++;
                }
            }
        }
        if (learnedCount === 0) $gameMessage.add("No new skills available for this level.");
    }
};