import Image from 'next/image'
import { useRouter } from 'next/router'
import * as data from './dictionary.json'

let totalLength = 0
for(let i = 0; i<data.length; ++i){
	totalLength+=data[i].length
}

export const base64ToInt = (b64) => {
	let result = 0
	for(let i = b64.length-1; i >= 0; --i){
		const c = b64[i].charCodeAt(0)
		if(b64[i] === "-"){
			result += 62 * Math.pow(64,2-i)
		}
		if(b64[i] === "_"){
			result += 63 * Math.pow(64,2-i)
		}
		if(c >= "0".charCodeAt(0) && c <= "9".charCodeAt(0)){
			result += parseInt(b64[i]) * Math.pow(64,2-i)
		}
		else if(c >= "A".charCodeAt(0) && c <= "Z".charCodeAt(0)){
			result += (10 + c - "A".charCodeAt(0)) * Math.pow(64,2-i)
		}
		else if(c >= "a".charCodeAt(0) && c <= "z".charCodeAt(0)){
			result += (36 + c - "a".charCodeAt(0)) * Math.pow(64,2-i)
		}
		console.log(result)
	}
	
	return result
}

export const intToBase64 = (integer) => {
	let remainingInteger = integer
	let response = ""
	for(let i = 0; i<3; ++i){
		const digit = remainingInteger%64
		if(digit >= 0 && digit < 10){
			response = parseInt(digit) + response
		}
		else if(digit >= 10 && digit < 36){
			response = String.fromCharCode(digit - 10 + "A".charCodeAt(0)) + response
		}
		else if(digit >= 36 && digit < 62){
			response = String.fromCharCode(digit - 36 + "a".charCodeAt(0)) + response
		}
		else if (digit == 62){
			response = "-" + response
		}
		else if (digit == 63){
			response = "_" + response
		}
		else{
			response = "0" + response
		}
		remainingInteger = Math.floor(remainingInteger/64)
		
	}
	return response
}

export const slugFromHaiku = (haiku) => {
	let tokenizedHaiku = haiku.split(/\s+/)
	let slug = ""
	tokenizedHaiku.forEach( w => {
		const word = w.replace(/[^0-9a-z']/gi, '').trim().toLowerCase()
		let relativeIndex = -1
		let index = 0
		let i = 0
		while(w!="" && relativeIndex==-1 && i<data.length){
			relativeIndex = data[i].findIndex(element => element.word?.trim() == word)
			console.log(data[i].length)
			if(relativeIndex > -1){
				slug+=intToBase64(relativeIndex+index)
				console.log("here: " + relativeIndex)
			}
			index += data[i].length
			++i
		}
	})
	return slug
}

const decode = (slug, syllables, line) => {
	if (slug == undefined || slug.length<=0)
	{
		return ""
	}

	let wordNumber = base64ToInt(slug.substring(0,3))

	if(wordNumber >= totalLength){
		return "error"
	}

	let word = ""
	let index = 0
	let i = 0
	while (word == ""){
		if(i >= data.length){
			throw new Error("invalid")
		}
		else if (wordNumber > index + data[i].length){
			index += data[i].length;
			++i;
		}
		else {
			word = data[i][wordNumber-index]
		}
	}

	let newline = false
	if(line == 2){
		if(syllables>7){
			//throw Error("Too long")
		}
		if(syllables >= 7){
			newline = true
			++line
			syllables = 0
		}
	}
	else {
		if (syllables>5){
			//throw Error("Too long")
		}
		else 
		if(syllables >= 5){
			newline = true
			++line
			syllables = 0
		}
	}

	let result = word.word + " "
	if(newline){
		return [<br key={0} />, result, decode(slug.substring(3,Math.max(2,slug.length)), syllables+word.syl, line)]
	}
	return [result, decode(slug.substring(3,Math.max(2,slug.length)), syllables+word.syl, line)]
}

export const generateRandomHaiku = () => {
	let haiku = ""
	getLineForSyllableCount(5)
	getLineForSyllableCount(7)
	getLineForSyllableCount(5)

	function getLineForSyllableCount(count) {
		let remainingSyllables = count
		while (remainingSyllables > 0) {
			let maximumWordIndex = 0

			for (let i = 0; i < remainingSyllables; ++i) {
				maximumWordIndex += data[i].length
			}

			let wordNumber = Math.floor(Math.random() * maximumWordIndex)

			let syllables = 0
			let index = 0
			for (let i = 0; index < wordNumber; ++i) {
				index += data[i].length
				++syllables
			}

			haiku+=intToBase64(wordNumber)
			remainingSyllables -= syllables
		}
	}
	return haiku
}

export default function Haiku() {
	const router = useRouter()

	let haiku = decode(router.query.loc, 0, 1)
	
  	return (
		<div>
    		<h2 className="flex min-h-screen flex-col items-center justify-between p-24">
    			{haiku}
			</h2>
			<a href={`${generateRandomHaiku()}`}>Try a random haiku</a>
			<div><a href="/">Enter a new Haiku</a></div>
			<footer>
				<a href="http://colefrishman.com">Cole Frishman.com</a>
			</footer>
		</div>
	)
}

