import User from "../../database/models/User";
import { createFeature } from "../../handlers/features";
import Profession from "./profession";

export default createFeature({
    active: false,
    name: 'professions',
    description: 'Paga as profissões registradas.',
    async execute(guild) {
        const professions = {
            moderator: new Profession('moderator'),
            animator: new Profession('animator')
        }
 
        let alreadyPaid: boolean = false;
        setInterval(() => alreadyPaid = false, 1000 * 60 * 60 * 24);
        
        setInterval(async () => {
            const dateNow = new Date();

            const isMonday = dateNow.getDay() === 1;

            if(!isMonday || alreadyPaid) return;

            for(const professionName of Object.keys(professions)) {
                const profession = professions[<keyof typeof professions>professionName];
                if(!profession.id) continue;

                const role = guild.roles.cache.get(profession.id);
                if(!role) continue;
                
                for(const member of role.members.values()) {
                    const foundUser = await User.findOne({ id: member.id });

                    if(!foundUser) {
                        await new User({
                            id: member.id,
                            money: profession.paycheck
                        }).save();
                    } else {
                        foundUser.money += profession.paycheck;
                        await foundUser.save();
                    }
                }
            }

            alreadyPaid = true;
        }, 1000 * 60);
    }
})