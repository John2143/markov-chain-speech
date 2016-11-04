let fs = require("fs");

function addToDict(markovWords, word){
    return markovWords[word] = {
        count: 0,
        next: {}
    };
}

/*This is what a dictionary looks like
 * {
 *   word:{
 *     count: wordCount,
 *     next: {
 *       "nextWord1": nextWordFreq1,
 *       "nextWord2": nextWordFreq2,
 *       //...
 *     }
 *   },
 *   //...
 * }
 *
 * markovWords = {
 *   the: {count: 9, next: {
 *     cat: 5,
 *     hat: 3,
 *     mat: 1,
 *   }},
 *   cat: {count: 5, next: {
 *     in: 3,
 *     '': 2,
 *   }},
 *   in: {count: 3, next: {
 *     the: 3,
 *   }},
 *   //...
 * };
 */

function addWordPair(markovWords, a, b){
    if(!markovWords[a]) addToDict(markovWords, a);
    if(!markovWords[b]) addToDict(markovWords, b);

    markovWords[a].count++;

    if(!markovWords[a].next[b]) markovWords[a].next[b] = 0;
    markovWords[a].next[b]++;
}

//Returns size elements starting at index
function tuple(arr, index, size){
    return arr.slice(index, index + size);
}

//function parseText(text, granularity){
    //let splitWords = text.split(/[ \r\n]/g);
    //for(let i = 0; i < splitWords.length - granularity; i++){
        //addmarkovWords(...tuple(splitWords, i, granularity));
    //}
//}
function parseText(text){
    //Splitting at \r and \n causes newlines to be interpreted as a blank word.
    let splitWords = text.split(/[ \r\n]/g);
    let markovWords = {};

    //Split every word into pairs:
    //  "This is a test" becomes
    //  ("This", "is"), ("is", "a"), ("a", "test")
    for(let i = 0; i < splitWords.length - 1; i++){
        addWordPair(markovWords, ...tuple(splitWords, i, 2));
    }

    return markovWords;
}

//Random number on the interval 0 to (exclsuive) i
function rand(i){
    return Math.floor(Math.random() * i);
}

function chooseNextWord(markovWords, curWord){
    let wordObj = markovWords[curWord];

    //select a word, taking weight into account
    //This can be improved by using a binary tree instead of doing this O(n) garbage
    //This however is actually faster than the time it owuld take to create a tree
    //so for less than like 100 possible words this is ok.
    let ind = rand(wordObj.count);
    for(let i in wordObj.next){
        ind -= wordObj.next[i];
        if(ind <= 0) return i;
    }
}

function randomSentence(markovWords){
    //Blank represents linebreaks, so it starts with a word that started a line
    let word = "";
    let sentence = "";
    //Max size of 100.
    for(let i = 0; i < 100; i++){
        word = chooseNextWord(markovWords, word);

        //edge case thing to make it look better
        if(word == ""){
            sentence += "\n";
        }else{
            sentence += word
            sentence += " ";
        }
    }
    return sentence;
}

fs.readFile(process.argv[2] || "text.txt", "utf8", (err, dat) => {
    try{
        if(err) throw err;

        let words = parseText(dat);
        console.log(randomSentence(words));
    }catch(e){
        console.log(e);
    }
});
