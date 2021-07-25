import { globalCommon } from "./global";

export default {
    seeInventory: () => globalCommon()
        .setTitle('Seu inventário')
        .setDescription('Digite `!inventario [Nome do Item]` para ver o ícone do item selecionado'),
    
    seeItem: () => globalCommon()
}