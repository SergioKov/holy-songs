const ejemplo_ua = 
`[Як правильно писати слова-роздільники?]
Ось зарезервовані слова:
(писати їх з нового рядка і без лапок ('') )
-----------------------------------------   
'Інтро',
'Куплет',
'Перед Приспів',
'Передприспів',
'Приспів',
'Програш',
'Перед Брідж',
'Брідж',
'Кінцівка',
'Кода',
'Схема'
-----------------------------------------


Інтро
Наприклад: В рядку вище написано "Інтро"
І ви бачите справа, як текст розділився.


[Тут незарезервоване слово]
Якщо Ви бажаєте написати слово, яке не є зарезервованим,
або є відсутнім у приведенному вище списку,
його потрібно взяти у квадратні дужки [тут якесь слово]
і розмістити з початку рядка


[тут якесь слово з початку рядка]
Ось бачите, що слово в квадратних дужках
і з початку рядка виконує функцію слова-роздільника.


[Далі приклад пісні...]
------------------------

Інтро пісні
|D   |F#m |G   |G   |
 ···· ···· ···· ···· 
|Hm  |F#m |G   |G   |
 ···· ···· ···· ···· 


[1 куплет:]
(можна писати "1 куплет" без квадратних дужок)
(або "куплет 1", або "куплет 1 (2рази)", або "куплет 1 (х2)") 
 D                 F#m 
Ти за мене постраждав
           G          
І Себе віддав.
  D                F#m 
Смерть навіки подолав, 
             G         
Дав нове життя.


[Перед Приспів:]
    Em                
В світ прийшов,       
 G        D       A/C#
Небо відкрив нам.     
 Em                   
Без умов              
  G       D        A  
Ісус полюбив нас.     


[Приспів:] 
  Hm                 G     
Слава! Слава Богу в вишніх,
          D             A  
Нині і навічно слава Царю! 
  Hm               G       
Слава! Слава для Ісуса,    
           D            A  
Славити я буду любов Твою. 


[2 куплет:]
  D               F#m
Гріх любовʼю переміг, 
             G
Врятувавши світ,
       D                  F#m
Незрівнянний, Господи святий, 
                G
Прославлений навік.


[Програш:]
|Em  |Hm  |D/F# |G A  |
 ···· ···· ····  · ··· 


[Брідж:]
 Hm                     G         
Гідний, гідний честі, слави,      
             D                A   
Мудрості, пошани - Гідний Господь!
 Hm                     G         
Гідний, гідний честі, слави,      
             D/F#             A   
Мудрості, пошани - Гідний Господь!


[Кінцівка:]
|D   |F#m |G    |G                  |
 ···· ···· ····  ····                
                 Слава Богу в вишніх!
|Hm  |F#m |G    |G                  |
 ···· ···· · ··· ·                

[Схема як текст] 
Нижче написана схема як текст для того, 
щоб після добавлення тексту пісні в базу даних
можна було створити схему пісні, тобто її структуру,
де буде зазаначено, яку частину пісні (куплет, приспів, брідж)
скільки разів повторювати.


[Схема:]
(Інтро:)
(1 куплет:)
(Перед Приспів:)
(Приспів:)
(2 куплет:)
(Перед Приспів:)
(Приспів: x2)
(Програш:)
(Брідж:)
(Приспів: x2)
(Кінцівка:)
`;


const ejemplo_ru = 
`[Как правильно писать слова-разделители?]
Вот зарезервированные слова:
(писать их с новой строки и без кавычек (''))
-----------------------------------------
'Интро',
'Куплет',
'Пред Припев',
'Предприпев',
'Припев',
'Проигрыш',
'Пред Бридж',
'Бридж',
'Концовка',
'Кода',
'Схема'
-----------------------------------------


Интро
Например: В строке выше написано "Интро"
И вы видите справа, как текст разделился.


[Здесь незарезервированное слово]
Если вы хотите написать слово, которое не является зарезервированным,
или отсутствует в приведённом выше списке,
его нужно взять в квадратные скобки [здесь какое-то слово]
и разместить в начале строки


[здесь какое-то слово в начале строки]
Вот видите, что слово в квадратных скобках
и в начале строки выполняет функцию слова-разделителя.


[Далее пример песни...]
------------------------

Интро песни
|D   |F#m |G   |G   |
 ···· ···· ···· ···· 
|Hm  |F#m |G   |G   |
 ···· ···· ···· ···· 


[1 куплет:]
(можно писать "1 куплет" без квадратных скобок)
(или "куплет 1", или "куплет 1 (2 раза)", или "куплет 1 (x2)") 
 D                 F#m 
Ты за меня пострадал
           G          
И Себя отдал.
  D                F#m 
Смерть навеки победил, 
             G         
Дал новую жизнь.


[Перед Припев:]
    Em                
В мир пришёл,       
 G        D       A/C#
Небо открыл нам.     
 Em                   
Без условий              
  G       D        A  
Иисус возлюбил нас.     


[Припев:] 
  Hm                 G     
Слава! Слава Богу в вышних,
          D             A  
Ныне и вечно слава Царю! 
  Hm               G       
Слава! Слава для Иисуса,    
           D            A  
Славить я буду Твою любовь. 


[2 куплет:]
  D               F#m
Грех любовью победил, 
             G
Спас мир,
       D                  F#m
Несравненный, Господи святой, 
                G
Прославлен навеки.


[Проигрыш:]
|Em  |Hm  |D/F# |G A  |
 ···· ···· ····  · ··· 


[Бридж:]
 Hm                     G         
Достоин, достоин чести, славы,      
             D                A   
Мудрости, почёта — Достоин Господь!
 Hm                     G         
Достоин, достоин чести, славы,      
             D/F#             A   
Мудрости, почёта — Достоин Господь!


[Концовка:]
|D   |F#m |G    |G                  |
 ···· ···· ····  ····                
                 Слава Богу в вышних!
|Hm  |F#m |G    |G                  |
 ···· ···· · ··· ·                

[Схема как текст] 
Ниже написана схема как текст для того, 
чтобы после добавления текста песни в базу данных
можно было создать схему песни, то есть её структуру,
где будет указано, какую часть песни (куплет, припев, бридж)
сколько раз повторять.


[Схема:]
(Интро:)
(1 куплет:)
(Пред Припев:)
(Припев:)
(2 куплет:)
(Пред Припев:)
(Припев: x2)
(Проигрыш:)
(Бридж:)
(Припев: x2)
(Концовка:)
`;


const ejemplo_es = 
`[¿Cómo escribir correctamente palabras-separadoras?]
Estas son las palabras reservadas:
(escribirlas desde una nueva línea y sin comillas (''))
-----------------------------------------
'Intro',
'Verso',
'Estrofa',
'Pre-Estribillo',
'Pre Estribillo',
'Preestribillo',
'Estribillo',
'Interludio',
'Solo',
'Pre-Puente',
'Pre Puente',
'Puente',
'Outro',
'Final',
'Coda',
'Esquema'
-----------------------------------------


Intro
Por ejemplo: En la línea de arriba está escrito "Intro"
Y puedes ver a la derecha cómo el texto se ha dividido.


[Aquí una palabra no reservada]
Si deseas escribir una palabra que no está reservada,
o no aparece en la lista anterior,
debe colocarse entre corchetes [aquí alguna palabra]
y ubicarse al comienzo de una línea.


[aquí alguna palabra al comienzo de la línea]
Como puedes ver, una palabra entre corchetes
y al comienzo de una línea actúa como palabra-separadora.


[A continuación, un ejemplo de canción...]
------------------------

Intro de la canción
|D   |F#m |G   |G   |
 ···· ···· ···· ···· 
|Hm  |F#m |G   |G   |
 ···· ···· ···· ···· 


[1 estrofa:]
(se puede escribir "1 estrofa" sin corchetes)
(o "estrofa 1", o "estrofa 1 (2 veces)", o "estrofa 1 (x2)") 
 D                 F#m 
Tú sufriste por mí
           G          
Y te entregaste.
  D                F#m 
Venciste la muerte para siempre, 
             G         
Diste nueva vida.


[Pre Estribillo:]
    Em                
Viniste al mundo,       
 G        D       A/C#
Nos abriste el cielo.     
 Em                   
Sin condiciones              
  G       D        A  
Jesús nos amó.     


[Estribillo:] 
  Hm                 G     
¡Gloria! ¡Gloria a Dios en las alturas!,
          D             A  
Ahora y por siempre, gloria al Rey. 
  Hm               G       
¡Gloria! ¡Gloria a Jesús,    
           D            A  
Alabaré tu amor. 


[2 estrofa:]
  D               F#m
El pecado venciste con amor, 
             G
Salvando al mundo,
       D                  F#m
Inigualable, Señor Santo, 
                G
Alabado por siempre.


[Interludio:]
|Em  |Hm  |D/F# |G A  |
 ···· ···· ····  · ··· 


[Puente:]
 Hm                     G         
Digno, digno de honra y gloria,      
             D                A   
Sabiduría y alabanza — ¡Digno es el Señor!
 Hm                     G         
Digno, digno de honra y gloria,      
             D/F#             A   
Sabiduría y alabanza — ¡Digno es el Señor!


[Final:]
|D   |F#m |G    |G                  |
 ···· ···· ····  ····                
                 ¡Gloria a Dios en las alturas!
|Hm  |F#m |G    |G                  |
 ···· ···· · ··· ·                

[Esquema como texto] 
A continuación se escribe el esquema como texto para que, 
al añadir la letra de la canción a la base de datos,
se pueda generar el esquema de la canción, es decir, su estructura,
donde se indicará qué parte de la canción (estrofa, estribillo, puente)
se repite cuántas veces.


[Esquema:]
(Intro:)
(1 estrofa:)
(Pre Estribillo:)
(Estribillo:)
(2 estrofa:)
(Pre Estribillo:)
(Estribillo: x2)
(Interludio:)
(Puente:)
(Estribillo: x2)
(Final:)
`;


const ejemplo_en = 
`[How to properly write section-label words?]
Here are the reserved words:
(write them on a new line and without quotation marks (''))
-----------------------------------------
'Intro',
'Verse',
'Pre Chorus',
'Prechorus',
'Chorus',
'Interlude',
'Pre Bridge',
'Bridge',
'Ending',
'Coda',
'Structure'
-----------------------------------------


Intro  
For example: The line above says "Intro"  
And you can see on the right how the text is split.


[Here is a non-reserved word]  
If you want to write a word that is not reserved,  
or is missing from the list above,  
you need to put it in square brackets [some word here]  
and place it at the beginning of a line.


[some word at the beginning of a line]  
As you can see, a word in square brackets  
and at the start of a line acts as a section label.


[Here comes a song example...]  
------------------------

Song intro  
|D   |F#m |G   |G   |  
 ···· ···· ···· ····  
|Hm  |F#m |G   |G   |  
 ···· ···· ···· ····  


[Verse 1:]  
(you can write "Verse 1" without square brackets)  
(or "1st verse", or "verse 1 (2 times)", or "verse 1 (x2)")  
 D                 F#m  
You suffered for me  
           G          
And gave Yourself.  
  D                F#m  
You defeated death forever,  
             G         
Gave new life.


[Pre Chorus:]  
    Em                
You came into the world,  
 G        D       A/C#  
Opened heaven to us.  
 Em                   
Unconditionally,  
  G       D        A  
Jesus loved us.


[Chorus:]  
  Hm                 G     
Glory! Glory to God in the highest,  
          D             A  
Now and forever glory to the King!  
  Hm               G       
Glory! Glory to Jesus,  
           D            A  
I will praise Your love.


[Verse 2:]  
  D               F#m  
Sin was conquered by love,  
             G  
Saving the world,  
       D                  F#m  
Matchless, Holy Lord,  
                G  
Praised forever.


[Interlude:]  
|Em  |Hm  |D/F# |G A  |  
 ···· ···· ····  · ···  


[Bridge:]  
 Hm                     G         
Worthy, worthy of honor and glory,  
             D                A   
Wisdom and praise — Worthy is the Lord!  
 Hm                     G         
Worthy, worthy of honor and glory,  
             D/F#             A   
Wisdom and praise — Worthy is the Lord!


[Ending:]  
|D   |F#m |G    |G                  |  
 ···· ···· ····  ····  
                 Glory to God in the highest!  
|Hm  |F#m |G    |G                  |  
 ···· ···· · ··· ·  


[Structure as text]  
Below is the structure written as text so that,  
after adding the song lyrics to the database,  
a song structure can be generated — that is, its layout,  
indicating how many times to repeat each part (verse, chorus, bridge).


[Structure:]  
(Intro:)  
(Verse 1:)  
(Pre Chorus:)  
(Chorus:)  
(Verse 2:)  
(Pre Chorus:)  
(Chorus: x2)  
(Interlude:)  
(Bridge:)  
(Chorus: x2)  
(Ending:)
`;


const obj_ejemplos_song = {
    ua: ejemplo_ua,
    ru: ejemplo_ru,
    es: ejemplo_es,
    en: ejemplo_en,
};