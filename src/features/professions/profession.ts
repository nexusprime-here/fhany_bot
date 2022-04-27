import idCache from "../../database/ids";
import errors from "../../errors";
import logger from "../../utils/logger";

export default class Profession {
    id: string | undefined;
    name: string;
    paycheck: number;

    constructor(name: string) {
        this.name = name;

        const envPaycheckName = name.toUpperCase() + "_PAYCHECK";
        this.paycheck = parseInt(process.env[envPaycheckName] ?? "0");

        if(this.paycheck === 0) errors.envNotFound(envPaycheckName);
        
        idCache.get('professions').then(professions => {
            if(!professions) logger.error(`Profession ${this.name} id not found.`);

            this.id = professions?.[name];
        });
    }
}