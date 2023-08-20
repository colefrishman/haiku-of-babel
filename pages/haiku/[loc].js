import Image from 'next/image'
import { useRouter } from 'next/router'
import * as data from './dictionary.json'

export default function Haiku() {
	const router = useRouter()

	let totalLength = 0
	for(let i = 0; i<data.length; ++i){
		totalLength+=data[i].length
	}

	const base64ToInt = (b64) => {
		let result = 0
		for(let i = b64.length-1; i >= 0; --i){
			const c = b64[i].charCodeAt(0)
			if(b64[i] == "-"){
				result += 62
			}
			if(b64[i] == "_"){
				result += 63
			}
			if(c >= "0".charCodeAt(0) && c <= "9".charCodeAt(0)){
				result = result += parseInt(b64[i]) * Math.pow(64,2-i)
			}
			else if(c >= "A".charCodeAt(0) && c <= "Z".charCodeAt(0)){
				result = result += (10 + c - "A".charCodeAt(0)) * Math.pow(64,2-i)
			}
			else if(c >= "a".charCodeAt(0) && c <= "z".charCodeAt(0)){
				result = result += (36 + c - "a".charCodeAt(0)) * Math.pow(64,2-i)
			}
		}
		
		return result
	}

	const intToBase64 = (integer) => {
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
			console.log(digit)
			remainingInteger = Math.floor(remainingInteger/64)
			
		}
		console.log(response)
		return response
	}

	const decode = (slug, syllables) => {
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

		if(syllables>17){
			throw Error("Too long")
		}

		return word.word + " " + decode(slug.substring(3,Math.max(2,slug.length)), syllables+word.syl)
	}

	const generateRandomHaiku = () => {
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


	let haiku = decode(router.query.loc, 0)
	
  	return (
		<div>
    		<h1 className="flex min-h-screen flex-col items-center justify-between p-24">
    			{haiku}
			</h1>
			<a href={`${generateRandomHaiku()}`}>
				Another one?
			</a>
		</div>
	)
}
