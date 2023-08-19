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
				result = result += parseInt(b64[i]) * Math.pow(64,i)
				console.log("here")
			}
			else if(c >= "A".charCodeAt(0) && c <= "Z".charCodeAt(0)){
				result = result += (10 + c - "A".charCodeAt(0)) * Math.pow(64,i)
			}
			else if(c >= "a".charCodeAt(0) && c <= "z".charCodeAt(0)){
				result = result += (36 + c - "a".charCodeAt(0)) * Math.pow(64,i)
			}
			console.log(result)
		}
		
		return result
	}

	const decode = (slug, syllables) => {
		console.log(slug)
		if (slug == undefined || slug.length<=0)
		{
			return ""
		}

		let wordNumber = base64ToInt(slug.substring(0,3))
		console.log(wordNumber)

		if(wordNumber >= totalLength){
			return "error"
		}

		let word = ""
		let index = 0
		let i = 0
		while (word == ""){
			if (wordNumber > index + data[i].length){
				++i;
				++index;
				if(i>=data.length){
					throw new Error("too long")
				}
			}
			else {
				console.log(word)
				word = data[i][wordNumber-index]
			}
		}

		if(syllables>17){
			console.log(syllables)
			throw Error("Too long")
		}

		console.log(word)

		return word.word + " " + decode(slug.substring(3,Math.max(2,slug.length)), syllables+word.syl)
	}

	let haiku = decode(router.query.loc, 0)

  	return (
		<div>
    		<h1 className="flex min-h-screen flex-col items-center justify-between p-24">
    			{haiku}
			</h1>
			<button onClick={() => console.log(data.length)}>
				button
			</button>
		</div>
	)
}
