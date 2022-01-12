tinymce.PluginManager.add("synonym", function (editor, url) {
    editor.addButton("synonym", {
        text: "Lookup Synonyms",
        icon: false,
        onclick: () => {
            // opens a box on click
            tinymce.activeEditor.windowManager.open({
                title: 'Lookup Synonyms', // title area
                width: 363,
                height: 337,
                // body area
                body: [
                    // heading of page
                    {
                        type: 'container',
                        name: 'heading',
                        html: '<h5>Type in the word(s) and press enter for the synonyms</h5>',
                    },
                    // aearch box area
                    {
                        type: 'textbox',
                        name: 'SearchArea'
                    },
                    // container where result shows
                    {
                        type: 'container',
                        name: 'resultsContainer',
                        html: '<div class="results-wrapper"><h4>Synonyms: </h4><div id="results"></div>'
                    }
                ],
                buttons: [], // remove buttons of down area
                onsubmit: (event) => {
                    event.preventDefault();

                    var results = document.querySelector('#results'); // result container
                    var searchWord = event.data.SearchArea; // searched textbox area

                    if (event.data && searchWord) {

                        if (/^[a-zA-Z\s]*$/.test(searchWord)) {
                            editor.fetchSynonyms(searchWord); // fetch the synonyms value
                        }
                        else {
                            results.innerHTML = "The Word is Invalid"; // the word is invalid  , no synonyms found
                        }

                    }
                    else if (searchWord.length === 0) {
                        // search box is empty

                        if (results) {
                            results.innerHTML = "Please Enter a Word";
                        }

                    }
                }
            });
        },
    });
    editor.fetchSynonyms = async (searchValue) => {
        var results = document.querySelector('#results'); // result container
        var resultArr = []; // rsult array

        // api call
        await fetch(`https://api.datamuse.com//words?ml=${searchValue}`)
            .then(response => response.json())
            .then(json => resultArr = json)

        // if json is not empty
        if (resultArr && resultArr.length > 0) {
            var resultInner = "";

            resultArr.forEach(element => {
                resultInner += `<div class="synonym-result">${element.word}</div>`;
            })

            // add json
            results.innerHTML = resultInner;
            // add word to editor
            results.addEventListener('click', (event) => {

                if (event.target.classList.contains('synonym-result')) {
                    editor.insertContent(event.target.textContent + " ");
                    editor.windowManager.close(window);
                }

            })
        }
        else if (resultArr & resultArr.length == 0) {

            results.innerHTML = "No Result Found";

        } else {

            results.innerHTML = "Something Went Wrong!";

        }

    };
});

tinymce.init({
    selector: "textarea#text-area",
    plugins: "synonym", // custom plugin
    toolbar: "undo redo | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | indent outdent | synonym", // custom toolbar
});

