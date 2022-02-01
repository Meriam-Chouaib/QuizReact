import React, {useState} from 'react';
import { fetchQuizQuestions } from './Api';
//components
import QuestionCard from './components/QuestionCard';

//types
import {QuestionState, Difficulty} from './Api';

//styles
import './App.css';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;


const  App = () => {

  const [loading, setLoading] =useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
   //QuestionState[] c-a-d de type tableau du QuestionState
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  //gérer des nouveaux questions 
  const startTrivia = async () => {
    //au début 
    setLoading(true);
    setGameOver(false);

    //chercher des nouveaux questions
    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
      );
      //initialisation à 0 pour rejouer le quiz
      setQuestions(newQuestions);
      setScore(0);
      setUserAnswers([]);
      setNumber(0);
      setLoading(false);


  };
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver){
      //users userAnswers
      const answer = e.currentTarget.value;

      //check answer against the correct answers
      const correct = questions[number].correct_answer === answer;
      
      //add score if answer is correct
      if(correct) setScore(prev => prev +1);

      //save answrt in th array for user answers 
      const answerObject = {
        // question: questions[number].question,
      question: questions[number].question,
      answer,
      correct,
      correctAnswer: questions[number].correct_answer,

     };
     //put it in the answersarray 
     setUserAnswers((prev) => [...prev,answerObject]);


    }

  };

  const nextQuestion = () => {
    //move on the next question if we not replay at the last question
    const nextQuestion = number +1;

    if(nextQuestion === TOTAL_QUESTIONS){
      setGameOver(true);
    }else{
      setNumber(nextQuestion);
    }

  }


    return (
        <div className="App">
          <h1 className="titre"> REACT Quiz</h1>
          <div className="quiz">
         
          {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
            //si le nb de reponse ne dépasse pas nb total ou gameover false alors on affiche le boutton start
            <button className="start" onClick={startTrivia}>
                Start
            </button>
          ) : null}

          {!gameOver ? <p className="score">Score: {score} </p> : null }
          {loading ? <p className="loading_questions">Loading Questions ...</p>: null }
         
          {!gameOver && !loading && (
            //if w not loading and the game is not over then show question card
            <QuestionCard 
            
              
                questionNr={number+1}
                totalQuestions={TOTAL_QUESTIONS}
                question={questions[number].question}
                answers={questions[number].answers}
                userAnswer={userAnswers ? userAnswers[number] : undefined}
                callback = {checkAnswer}
              />
          )}

          {!gameOver && !loading && userAnswers.length === number + 1
           && number !== TOTAL_QUESTIONS - 1 ? (
             //if game not over and not loading and number questions != 10 then we show the button of next question
              <button className="next" onClick={nextQuestion}>
                  Next Question
              </button>
          ) : null}
        </div>
        </div>
            );
 
}

export default App;
