// переменные

let select1 = document.querySelector('.search-select') as HTMLSelectElement
let select2 = document.querySelector('.search-select2') as HTMLSelectElement
let input1 = document.querySelector('.input-search') as HTMLInputElement
let input2 = document.querySelector('.input-search2') as HTMLInputElement
let button1 = document.querySelector('.search_button') as HTMLButtonElement
let button2 = document.querySelector('.search_button2') as HTMLButtonElement
let exitButton = document.querySelector('.result_exit') as HTMLButtonElement
let result = document.querySelector('.result') as HTMLDivElement
let resultTitle = document.querySelector('.result_title') as HTMLTitleElement
let resultText = document.querySelector('.run_text') as HTMLDivElement
let spinner = document.querySelector('.spinner') as HTMLImageElement
let delimiter = document.querySelector('.delimiter') as HTMLDivElement
let audio = document.querySelector('.header__audio') as HTMLAudioElement
let resultMainTitle = document.querySelector('.result_main-title') as HTMLTitleElement



function animateTitle(){
    let entryPoint: number = result.getBoundingClientRect().bottom
    let endPoint: number = 0;
    const getInterval = setInterval(() => {
        endPoint = resultText.getBoundingClientRect().y
        if (endPoint <= entryPoint){
            resultMainTitle.classList.add('hide')
            clearInterval(getInterval)
        }
    }, 1000)
}

// описание объекта

// Определим типы функций
type SearchFunction = (query: string) => Promise<any>;
type GetByIdFunction = (id: string) => Promise<any>;

// Определим интерфейс для объекта с методами
interface IStarWarshObject {
    [key: string]: [SearchFunction, GetByIdFunction],
    people: [SearchFunction, GetByIdFunction];
    planets: [SearchFunction, GetByIdFunction];
    species: [SearchFunction, GetByIdFunction];
    films: [SearchFunction, GetByIdFunction];
    homeworld: [SearchFunction, GetByIdFunction];
    residents: [SearchFunction, GetByIdFunction];
    starships: [SearchFunction, GetByIdFunction];
    vehicles: [SearchFunction, GetByIdFunction];
}

// Предположим, что starWars определен таким образом


// Создадим объект с типизацией
const starWarsObject: IStarWarshObject = {
    people: [starWars.searchCharacters, starWars.getCharactersById],
    planets: [starWars.searchPlanets, starWars.getPlanetsById],
    species: [starWars.searchSpecies, starWars.getSpeciesById],
    films: [starWars.searchSpecies,starWars.getFilmsById],
    homeworld: [starWars.searchPlanets, starWars.getPlanetsById],
    residents: [starWars.searchCharacters, starWars.getCharactersById],
    starships: [starWars.searchSpecies,starWars.getStarshipsById],
    vehicles: [starWars.searchSpecies,starWars.getVehiclesById],
};

interface IStarWarsApi{
    [key: string]: string | string[]
}
// первая строка поиска

let choiceResult1: string = select1.value
let resultSearch1: string = '';
let choiceResult2: string = select2.value
let resultSearch2: string = '';

function visibleResult(): string{
    return result.style.visibility = 'visible'
}
function hideResult(): string{
    return result.style.visibility = 'hidden'
}
function hideSpinner(): string{
    return spinner.style.visibility = 'hidden'
}
function showSpinner(): string{
    return spinner.style.visibility = 'visible'
}

select1.addEventListener('change', handleSelectButton)
select2.addEventListener('change', handleSelectButton)
input1.addEventListener('change', handleInputButton)
input2.addEventListener('change', handleInputButton)

function handleSelectButton(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if(target === select1) {
       choiceResult1 = select1.value 
    } else if(target === select2) {
        choiceResult2 = select2.value
    }
    resultText.classList.remove('animation')
    resultMainTitle.classList.remove('animate-title')
    resultMainTitle.classList.remove('hide')
    resultSearch1 = ''
    input1.value = ''
    resultSearch2 = ''
    input2.value = ''
    hideResult()   
}
function handleInputButton(event:Event):void{
    const target = event.target as HTMLInputElement;
    if(target === input1) {
       resultSearch1 = input1.value 
       
    } else if(target === input2) {
        resultSearch2 = input2.value
    }
    resultText.classList.remove('animation')
    resultMainTitle.classList.remove('animate-title')
    resultMainTitle.classList.remove('hide')
    input1.value = ''
    input2.value = ''
    hideResult() 
}
function getId(StarWarsUrl:string): string | null{
    const regex:RegExp = /(\d+)\/$/
    const result:RegExpMatchArray | null = StarWarsUrl.match(regex)
    if(result) {
        return result[1]
    } else {
        return null
    }
}
function getString(StarWarsUrl:string): string | null{
    const regex:RegExp =  /api\/([a-zA-Z]+)\/\d+\//
    const result:RegExpMatchArray | null = StarWarsUrl.match(regex)
    if(result) {
        return result[1]
    } else {
        return null
    }
}
exitButton.addEventListener('click', (event:Event):void => {
    resultText.classList.remove('animation')
    resultMainTitle.classList.remove('hide')
    resultMainTitle.classList.remove('animate-title')
    hideResult()
    hideSpinner()
    audio.pause()
    event.preventDefault()
})

button1.addEventListener('click', async (event:Event) => {
    try{

        if (resultSearch1 === '') {
            audio.pause()
            event.preventDefault()
            throw new Error('Input is empty')
        }
        resultText.classList.remove('animation')
        resultMainTitle.classList.remove('animate-title')
        resultMainTitle.classList.remove('hide')
        audio.play()
        showSpinner()
        resultTitle.innerHTML = ''
        resultText.innerHTML = ''

        const searchFunctions = await starWarsObject[choiceResult1];

        if(Array.isArray(searchFunctions)) {

            event.preventDefault()

            let starWarsInfo = await searchFunctions[0](resultSearch1)

            for (let element of starWarsInfo.results){
                resultTitle.innerHTML += element.name;

                for (let key in element){
                    if(element[key] === null){
                         resultText.innerHTML += `<p>${key}: unknow</p>`
                    }

                    else if((Array.isArray(element[key])) && (key in starWarsObject) && (element[key].length > 0)){
                        resultText.innerHTML += `<p>${key}:</p>`

                        for (let item in element[key]){
                            const urlString: string | null= getString(element[key][item])
                            const urlId: string | null = getId(element[key][item])

                            if(urlString !== null && urlId !== null){
                                const urlInfo: any = await starWarsObject[urlString][1](urlId)
                                urlInfo.hasOwnProperty('title') ? resultText.innerHTML += `<p style="margin-left: 20px;">${urlInfo.title}</p>` : resultText.innerHTML += `<p style="margin-left: 20px;">${urlInfo.name}</p>`
                            }    
                        }  
                    }

                    else if((typeof element[key] === 'string') && (key in starWarsObject)){
                        resultText.innerHTML += `<p>${key}:</p>`
                        const urlString: string | null= getString(element[key])
                        const urlId: string | null = getId(element[key])

                        if(urlString !== null && urlId !== null){
                            const urlInfo: any = await starWarsObject[urlString][1](urlId)
                            resultText.innerHTML += `<p style="margin-left: 20px;">${urlInfo.name}</p>`
                        }
                    }

                    else { resultText.innerHTML += `<p>${key}: ${element[key]}</p>` }
                }
            }
        }
        animateTitle()
        visibleResult()
        resultMainTitle.classList.add('animate-title')
        resultText.classList.add('animation')
        hideSpinner()
        resultSearch1 = ''
        event.preventDefault();  

    } catch (e:unknown | Error) {
        alert(e)
        hideResult()
        hideSpinner()
        button1.classList.remove('hasactive')
        event.preventDefault();
    }    
})
button2.addEventListener('click', async (event:Event) => {

    try{

        if (resultSearch2 === '') {
            audio.pause()
            event.preventDefault()
            throw new Error('Input is empty')
        }

        resultText.classList.remove('animation')
        resultMainTitle.classList.remove('animate-title')
        resultMainTitle.classList.remove('hide')
        audio.play()
        showSpinner()
        resultTitle.innerHTML = ''
        resultText.innerHTML = ''

        const searchFunctions = await starWarsObject[choiceResult2]

        if(Array.isArray(searchFunctions)){

            event.preventDefault()

            let starWarsInfo = await searchFunctions[1](resultSearch2)
            resultTitle.innerHTML += starWarsInfo.name

            for (let key in starWarsInfo){

                if (starWarsInfo[key] === null){
                    resultText.innerHTML += `<p>${key}: unknow</p>`
                }

                else if((Array.isArray(starWarsInfo[key])) && (key in starWarsObject) && (starWarsInfo[key].length > 0)){
                    resultText.innerHTML += `<p>${key}:</p>`

                    for (let item in starWarsInfo[key]){
                        const urlString: string | null= getString(starWarsInfo[key][item])
                        const urlId: string | null = getId(starWarsInfo[key][item])

                        if(urlString!== null && urlId!== null){
                            const urlInfo: any = await starWarsObject[urlString][1](urlId)
                            urlInfo.hasOwnProperty('title') ? resultText.innerHTML += `<p style="margin-left: 20px;">${urlInfo.title}</p>` : resultText.innerHTML += `<p style="margin-left: 20px;">${urlInfo.name}</p>`
                        }
                    }
                }

                else if((typeof starWarsInfo[key] === 'string') && (key in starWarsObject)){
                    resultText.innerHTML += `<p>${key}:</p>`
                    const urlString: string | null= getString(starWarsInfo[key])
                    const urlId: string | null = getId(starWarsInfo[key])

                    if(urlString !== null && urlId !== null){
                        const urlInfo: any = await starWarsObject[urlString][1](urlId)
                        resultText.innerHTML += `<p style="margin-left: 20px;">${urlInfo.name}</p>`
                    }
                }

                else { resultText.innerHTML += `<p>${key}: ${starWarsInfo[key]}</p>` }
            }
        }
        animateTitle()
        visibleResult()
        resultMainTitle.classList.add('animate-title')
        resultText.classList.add('animation')
        hideSpinner()
        resultSearch2 = ''
        event.preventDefault();

    }catch (e:unknown | Error) {
        alert(e)
        hideResult()
        hideSpinner()
        button1.classList.remove('hasactive')
        event.preventDefault();
    } 
})