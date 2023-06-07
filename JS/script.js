// VARIABLES
let audio; // audio
const container = document.getElementsByClassName('container')[0]; // container
const searchBox = document.getElementById('search-box')
const searchBtn = document.getElementById('search-btn');



let findWord = async (word) => {

    let response = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + word);

    if (response.status != 404) {
        return response.json();
    } else {
        return {
            status: 404,
            ok: false,
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                message: 'No Content found.',
                word: word
            })
        }
    }

}

let mainFunction = async (word) => {
    let response = await findWord(word);
    return response;

}



/**
 * Creating Templates
*/

let createEmptyTemplate = (value) => {
    console.log('Empty Template Creation Started.');
    console.log(value);

    const word = JSON.parse(value.body).word;
    // para
    const para = document.createElement('p');
    para.classList.add('noresult');
    if(word == '') {
        para.textContent = `Please enter any word to search.`;

    } else {
        para.textContent = `We are sorry, we have no result for "${word}" in our dictionary, please try to search another.`;
    }
    container.appendChild(para);
}

let createResultTemplate = (value) => {
    console.log(value);
    const varients = value.length;
    for (let i = 0; i < varients; i++) {

        // PARENT LIST 
        const parentList = document.createElement('ul'); // creating list
        parentList.classList.add('parent'); // adding class

        let synonyms = '';
        let antonyms = '';

        for (let j = 0; j < 3; j++) {
            // PARENT LIST ITEMS
            const parentListItem = document.createElement('li');


            if (j == 0) {

                // MAIN LIST
                const mainList = document.createElement('ul');
                mainList.classList.add('main');

                // adding elements to mainlist
                for (let k = 0; k < 3; k++) {

                    // MAIN LIST ITEMS
                    const mainListItem = document.createElement('li');


                    if (k == 0) {
                        // WORD HEADING
                        const heading = document.createElement('h2');
                        heading.textContent = value[i].word;
                        mainListItem.appendChild(heading);
                    }

                    if (k == 1) {
                        let phonetic;

                        if (value[0].phonetic != undefined) {
                            phonetic = value[0].phonetic;

                        } else if (value[0].phonetics[0].text != undefined) {
                            phonetic = value[0].phonetics[0].text;

                        } else if (value[0].phonetics[1].text != undefined) {
                            phonetic = value[0].phonetics[1].text;

                        }

                        mainListItem.textContent = phonetic;
                    }

                    if (k == 2) {
                        mainListItem.innerHTML = '<img src="RESOURCES/sound-icon.svg" alt="audio button" class="audiobtn">';
                        let audioLink;
                        try {
                            if (value[0].phonetics[0].audio != undefined && value[0].phonetics[0].audio.length != 0) {
                                audioLink = value[0].phonetics[0].audio;
                            } else if (value[0].phonetics[1].audio != undefined && value[0].phonetics[1].audio.length != 0) {
                                audioLink = value[0].phonetics[1].audio;
                            } else if (value[0].phonetics[2].audio != undefined && value[0].phonetics[2].audio.length != 0) {
                                audioLink = value[0].phonetics[2].audio;
                            }
                        } catch (err) {
                            console.log(err);
                            console.log('No audio found.');
                        }


                        audio = new Audio(audioLink);

                    }
                    mainList.appendChild(mainListItem);
                }
                parentListItem.appendChild(mainList);


            }


            if (j == 1) {

                let meanings = value[i].meanings.length;

                for (let k = 0; k < meanings; k++) {


                    // synonymns and antonmns
                    synonyms += value[i].meanings[k].synonyms.join(', ');
                    antonyms += value[i].meanings[k].antonyms.join(', ');


                    // SUB LIST
                    let subList = document.createElement('ul');
                    subList.classList.add('sub');

                    // SUB LIST ITEM
                    let subListItem = document.createElement('li'); // creating sub list item

                    // MEANING HEADING
                    let meaningHeading = document.createElement('h3'); // getting meaning heading (part of speech)
                    meaningHeading.textContent = value[i].meanings[k].partOfSpeech; // updating textual content

                    // DEFINITIONS
                    // DEFINITION ORDERED LIST
                    let definitionOl = document.createElement('ol');

                    for (let l = 0; l < value[i].meanings[k].definitions.length; l++) {
                        // DEFINITION  ORDERED LIST ITEM
                        let definitionLi = document.createElement('li');
                        definitionLi.textContent = `${l+1}. ${value[i].meanings[k].definitions[l].definition}`;
                        definitionOl.appendChild(definitionLi);

                        // EXAMPLE
                        if (value[i].meanings[k].definitions[l].example != undefined) {

                            // EXAMPLE LIST
                            const exampleList = document.createElement('ul');
                            exampleList.innerHTML = `<li><h4>Example: </h4></li> <li>${value[i].meanings[k].definitions[l].example}</li>`;
                            definitionOl.appendChild(exampleList);
                        }

                        // SYNONYMS AND ANTONYMS
                        synonyms += value[i].meanings[k].definitions[l].synonyms.join(', '); // synonyms
                        antonyms += value[i].meanings[k].definitions[l].antonyms.join(', ') // antonyms



                    }

                    subListItem.appendChild(meaningHeading);
                    subListItem.appendChild(definitionOl);
                    subList.appendChild(subListItem); // appending the sublist item

                    parentListItem.appendChild(subList);
                }



            }

            if (j == 2) {
                if (synonyms.length >= 1) {
                    // SYNONYMS LIST
                    const synonymList = document.createElement('ul');
                    synonymList.innerHTML = `<ul> <li><h4>Synonyms</h4> </li> <li>${synonyms}</li></ul>`;
                    parentListItem.appendChild(synonymList);
                }

                if (antonyms.length >= 1) {
                    // ANOTNYMS LIST
                    const antonymsList = document.createElement('ul');
                    antonymsList.innerHTML = `<ul> <li><h4>Antonyms</h4> </li> <li>${antonyms}</li></ul>`;
                    parentListItem.appendChild(antonymsList);
                }
            }



            parentList.appendChild(parentListItem);
        }

        container.appendChild(parentList); // adding into container


    }

    // AUDIO
    let audioButtons = document.getElementsByClassName('audiobtn'); // getting audio element
    for (let i = 0; i < audioButtons.length; i++) {
        let isPlay = false;

        audioButtons[i].addEventListener('click', () => {

            audio.play();
        })
    }

}

let clearTemplate = () => {
    container.innerHTML = '';
}



let search = async ()=> {
    clearTemplate();
    const word = searchBox.value;
    mainFunction(word).then((value) => {
        if (value.status != 404) {
            createResultTemplate(value);
        } else {
            createEmptyTemplate(value);
        }
    });
}

// SEARCH EVENTS
searchBtn.addEventListener('click', search); // button
document.addEventListener('keydown', (event)=> {
    if(event.key === 'Enter') {
        search();
    }
})

