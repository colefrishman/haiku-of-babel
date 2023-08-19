import csvParser from 'csv-parser'

let WordsMap = new Map();
let csvText = await fetch('http://localhost:3000/dictionary.csv')
	.pipe(csvParser())
	.on('data', (data) => WordsMap.set(data[0], data[1]))
	.on('end', () => {
		console.log(results);
})
csvText.split('\n').array.forEach(line => {
	const pair = line.split
	WordsMap.set(pair[0], pair[1])
});

export default WordsMap