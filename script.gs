// Commands: https://script.google.com/macros/s/AKfycbyPHaH9XC5na8ohNS-goRkgmyEkjGhKQzgHYURdK4UFdyMU_II/exec?command=<string>&args=<JSON array>
// Commands: https://script.google.com/macros/s/AKfycbyPHaH9XC5na8ohNS-goRkgmyEkjGhKQzgHYURdK4UFdyMU_II/exec?command=showNames&args=%5B%5D
// Commands: https://script.google.com/macros/s/AKfycbyPHaH9XC5na8ohNS-goRkgmyEkjGhKQzgHYURdK4UFdyMU_II/exec?command=guessName&args=%5B%22Neil%22%5D

const output = ContentService.createTextOutput.bind(ContentService);
const CHARACTER_LIMIT = 400;

function doGet(request) {
    const command = request.parameter.command;
    const sheet = SpreadsheetApp.getActiveSheet();
    return commands[command](sheet, ...JSON.parse(request.parameter.args));
}

const commands = {
    guessName(sheet, guessedName) {
        guessedName = normalizeName(guessedName);
        const alreadyGuessedNames = new Set(getNames(sheet));
        if (alreadyGuessedNames.has(guessedName)) {
            return output(`${guessedName} has already been guessed.`);
        } else {
            sheet.appendRow([guessedName]);
            return output(`${guessedName} has been added to the list of guessed names.`);
        }
    },
    showNames(sheet, pageNum = 1) {
        console.log('Got showNames request, pageNum:', pageNum);
        let names = getNames(sheet).sort();
        const pages = []
        while (names.length) {
            const [toRemove, page] = makePage(names, pages.length);
            pages.push(page);
            names = names.slice(toRemove);
        }
        console.log('pages:', pages);
        return output(pages[pageNum - 1]);
    },
}

function getNames(sheet) {
    return sheet.getDataRange().getValues().map(row => normalizeName(row[0]))
}

function makePage(names, pageNum) {
    const nextPageMsg = `"!showguesses ${pageNum + 2}" for more`;
    let page = `${names.slice(0, -1).join(', ')} and ${names.slice(-1)[0]}`;
    if (page.length <= CHARACTER_LIMIT) {
        return [names.length, page];
    }
    const possiblePages = names.map((name, index) => {
        return `${names.slice(0, index + 1).join(', ')} ${nextPageMsg}`;
    }).reverse();
    const lastName = possiblePages.findIndex(page => page.length <= CHARACTER_LIMIT);
    return [possiblePages.length - lastName, possiblePages[lastName]];
}

function normalizeName(name) {
    return name[0].toUpperCase() + name.substring(1).toLowerCase();
}
