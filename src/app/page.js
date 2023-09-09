'use client';

import Image from 'next/image'
import { useState } from 'react';
import { generateRandomHaiku, slugFromHaiku } from '../../pages/haiku/[loc]';

export default function Home() {
	const [value, setValue] = useState("syllable word word syllable syllable word syllable word word")

	return (
    	<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<textarea className="h-20" value={value} onChange={(e) => {setValue(e.target.value)}} />
			<br />
			<button onClick={() => {window.location.href = `/haiku/${slugFromHaiku(value)}`}}>Go!</button>
			<div><a href={`/haiku/${generateRandomHaiku()}`}>Or try a random haiku</a></div>
    	</main>
  )
}
