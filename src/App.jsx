// Css
import './App.css';

// React
import { useCallback, useEffect, useState } from 'react'

// Data
import { wordsList } from './data/words'

// Componentes
import StartScreen from './components/StartScreen'
import GameScreen from './components/GameScreen'
import EndScreen from './components/EndScreen'

const stages = [
    {id: 1, name: 'start'},
    {id: 2, name: 'game'},
    {id: 3, name: 'end'}
]

const guessesQty = 10

function App() {

    // Estágio do game e palavras
    const [gameStage, setGameStage] = useState(stages[0].name)
    const [words] = useState(wordsList)

    // Palavra, categoria e letras escolhidas
    const [pickedWord, setPickedWord] = useState('')
    const [pickedCategory, setPickedCategory] = useState('')
    const [letters, setLetters] = useState([])

    // Letras adivinhadas corretas e erradas, chances e pontuação
    const [guessedLetters, setGuessedLetters] = useState([])
    const [wrongLetters, setWrongLetters] = useState([])
    const [guesses, setGuesses] = useState(guessesQty)
    const [score, setScore] = useState(0)

    const pickWordAndCategory = () => {

        // Pick a random category
        const categories = Object.keys(words)
        const category = categories[Math.floor(Math.random() * categories.length)]

        // Pick a random word
        const word = words[category][Math.floor(Math.random() * words[category].length)]

        return {word, category}
    }
    
    // Função para iniciar o jogo
    const startGame = () => {

        // Escolher a palavra e categoria
        const {word, category} = pickWordAndCategory()

        // Criando um array de letras da palavra escolhida 
        let wordLetters = word.split('')
        wordLetters = wordLetters.map((l) => l.toLowerCase())

        // Setar os states
        setPickedWord(word)
        setPickedCategory(category)
        setLetters(wordLetters)

        console.log(pickedWord, pickedCategory, letters)

        setGameStage(stages[1].name)
    }

    // Processar as letras no jogo
    const verifyLetter = (letter) => {

        const normalizedLetter = letter.toLowerCase()

        // Verificar se a letra já foi utilizada
        if(guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
            return
        }

        // Atualizando letras corretas e erradas, utilizando desestruturação
        if(letters.includes(normalizedLetter)) {

            setGuessedLetters((actualGuessedLetters) => [
                ...actualGuessedLetters, 
                normalizedLetter
            ])
        } else {

            setWrongLetters((actualWrongLetters) => [
                ...actualWrongLetters, 
                normalizedLetter
            ])

            setGuesses((actualGuesses) => actualGuesses - 1)
        }
    }

    const clearLetterStates = () => {

        setGuessedLetters([])
        setWrongLetters([])
    }

    /* Utilizamos o useEffect quando queremos disparar determinado evento quando uma variável em questão 
       tiver seu estado alterado */
    useEffect(() => {

        // Quando as tentativas forem 0 ocorre o gameover
        if(guesses <= 0) {    

            // Resetar os estados - letras certas e erradas
            clearLetterStates()
            
            setGameStage(stages[2].name)
        }

    }, [guesses])

    // Função para reiiniciar o jogo
    const retryGame = () => {

        // Resetar os estados - pontuação e tentativas
        setScore(0)
        setGuesses(guessesQty)

        setGameStage(stages[0].name)
    }

    return (
        <div className="App">
            
            {gameStage === 'start' && <StartScreen startGame={startGame} />}
            {gameStage === 'game' && (
                <GameScreen 
                    verifyLetter={verifyLetter} 
                    pickedWord={pickedWord}
                    pickedCategory={pickedCategory}
                    letters={letters}
                    guessedLetters={guessedLetters}
                    wrongLetters={wrongLetters}
                    guesses={guesses}
                    score={score}
                />
            )}
            {gameStage === 'end' && <EndScreen retryGame={retryGame} />}
        </div>
    );
}

export default App;
