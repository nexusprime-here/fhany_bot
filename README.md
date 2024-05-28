# O que diabos é isso?
Este é um bot criado em 2020 para o servidor da Fhany, esteve ativo por aproximadamente à 2 anos antes de ser deprecated.
Este bot não é exatamente útil. Era somente funcionalidades que eu imaginei e inventei por diversão. 
Este projeto representou muito para mim, aos meus 16-18 anos, me ensinou muitos dos erros que cometi e dos acertos também.
Use como quiser, algumas funcionalidades foram apagadas pelo desuso ou por pedido da própria Fhany, mas estão presentes nos commits antigos.

# Objetivo
Mas por trás desse hoobie, eu tinha em mente uma criação muito além: [Quadro de anotações](https://whimsical.com/bony-4e3zzaxuLUwigBihga3ur6).
Caso você tenha se interessado por essa antiga idéia e queira colocar em prática me contate.

# Erros como Programador
## Funcionalidades Inúteis
A maior parte das funcionalidades são invenções, não são algo que curam uma necessidade do público alvo da Fhany ou da mesma.
Isso foi um grande erro no total, visto que o bot se tornou mais um luxo do que uma necessidade.

## Serviços linkados com os controladores
As operações (GET, DELETE, CREATE e EDIT) de alguns comandos estão imbutidos nos próprios comandos.
Isso é uma péssima prática no geral, pois dificulta as atualizações e a manutenção. O correto
seria criar um "service" ou um "handler" para cada funcionalidade, que seria uma classe.
Isso pode ser visto no BoosterCall (Ou temporary call se tiver usando uma versão antiga).

## Burnouts
Pela quantidade exagerada de tempo que eu passava editando o código dessa coisa, tive uma exaustão mental grande.
