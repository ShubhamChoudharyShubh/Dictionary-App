const form = document.querySelector('form');
const resultDiv = document.querySelector('.result');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    getWordInfo(form.elements[0].value);
});

const getWordInfo = async (word) => {
    try {
        resultDiv.innerHTML = "Fetching Data...";
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();

        if (!data || !data.length) {
            resultDiv.innerHTML = `<p>Sorry, Word Not Found</p>`;
            return;
        }

        let definitions = data[0].meanings[0].definitions[0];
        resultDiv.innerHTML = `
            <h2><strong>Word:</strong> ${data[0].word}</h2>
            <p>${data[0].meanings[0].partOfSpeech}</p>
            <p><strong>Meaning:</strong> ${definitions.definition || "Not Found"}</p>
            <p><strong>Example:</strong> ${definitions.example || "Not Found"}</p>
            <p><strong>Antonyms:</strong></p>
        `;

        // Fetching antonyms
        if (!definitions.antonyms || definitions.antonyms.length === 0) {
            resultDiv.innerHTML += `<span>Not Found</span>`;
        } else {
            for (let i = 0; i < definitions.antonyms.length; i++) {
                resultDiv.innerHTML += `<li>${definitions.antonyms[i]}</li>`;
            }
        }

        // Adding read more button
        if (data[0].sourceUrls && data[0].sourceUrls.length > 0) {
            resultDiv.innerHTML += `<div><a href="${data[0].sourceUrls[0]}" target="_blank">Read More</a></div>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<p>Sorry, Word Not Found. Error: ${error.message}</p>`;
    }
};
