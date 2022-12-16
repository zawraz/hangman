import { useEffect, useState, useCallback } from "react";
import { HangmanDrawing } from "./HangmanDrawing";
import { HangmanWord } from "./HangmanWord";
import { Keyboard } from "./Keyboard";
import words from "./wordList.json";

function App() {
	const [wordToGuess, setWordToGuess] = useState(() => {
		return words[Math.floor(Math.random() * words.length)];
	});
	const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

	const incorrectLetters = guessedLetters.filter(
		letter => !wordToGuess.includes(letter)
	);

	const isLoser = incorrectLetters.length >= 6;
	const isWinner = wordToGuess
		.split("")
		.every(letter => guessedLetters.includes(letter));

	const addGuessedLetter = useCallback(
		(letter: string) => {
			if (guessedLetters.includes(letter) || isLoser || isWinner) return;

			setGuessedLetters(currentLetters => [...currentLetters, letter]);
			console.log("useCallback run");
		},
		[guessedLetters, isWinner, isLoser]
	);
	console.log("guessed: ", guessedLetters, "incorrect: ", incorrectLetters);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			const key = e.key;
			if (!key.match(/^[a-zA-Z]$/)) return;

			e.preventDefault();
			addGuessedLetter(key);
			console.log("useEffect run");
		};

		document.addEventListener("keypress", handler);

		return () => {
			document.removeEventListener("keypress", handler);
		};
	}, []);

	return (
		<div
			style={{
				maxWidth: "800px",
				display: "flex",
				flexDirection: "column",
				gap: "2rem",
				margin: "0 auto",
				alignItems: "center",
			}}
		>
			<div
				style={{
					fontSize: "2rem",
					textAlign: "center",
				}}
			>
				{isWinner && "You won! - Refresh the page to play again"}
				{isLoser && "You lost! - Refresh the page to redeem your soul"}
			</div>
			<HangmanDrawing numberOfGuesses={incorrectLetters.length} />
			<HangmanWord
				reveal={isLoser}
				guessedLetters={guessedLetters}
				wordToGuess={wordToGuess}
			/>
			<Keyboard
				disabled={isWinner || isLoser}
				activeLetters={guessedLetters.filter(letter =>
					wordToGuess.includes(letter)
				)}
				inactiveLetters={incorrectLetters}
				addGuessedLetter={addGuessedLetter}
			/>
		</div>
	);
}

export default App;
