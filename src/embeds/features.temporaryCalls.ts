import { globalCommon, globalError, globalSucess } from "./global";

export default {
    alreadyOnCall: globalError()
        .setDescription('Você já está em um canal de voz, você não pode criar um Canal de Voz Temporário até que desconecte do Canal que está.'),

    alreadyCreatedCall: globalError()
        .setDescription('Você já criou um Canal de Voz temporário, você não pode criar outro até que aquele seja excluído'),

    error: globalError()
        .setDescription('Não consegui criar o Canal de Voz, tente novamente mais tarde.'),

    sucess: globalSucess()
        .setDescription('Seu canal foi criado com sucesso!'),

    controllerMessage: globalCommon()
        .setTitle('Canal de Voz Temporário para Games!')
        .setDescription('Selecione uma categoria de jogos abaixo para spawnar um Canal de Voz Temporário. \n\nQuando não estiver usando o canal será deletado.')
}