/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

function App() {
  const [questions, setQuestions] = useState([]);
  const [curr, setCurr] = useState(0);
  const [answers, setAnswers] = useState({});
  const [ans, setAns] = useState('');
  const [isMandatory, setIsMandatory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load questions from api
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch('https://the-trivia-api.com/api/questions');
        const data = await response.json();
        for(const i in data){
          if (i <= 10){
          data[i].new_id = i;
          setQuestions( arr => [...arr, data[i]]);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    

    loadQuestions();
    // shuffle();
  }, []);

 
  const handleNext = (e) => {
    setCurr(curr + 1);
    setAns('')
    setIsMandatory(!isMandatory);
    console.log(isMandatory)
  };

  const handleBack = () => {
    setCurr(curr - 1);
  };

  const handleAnswerChange = (event) => {
    const { name, value } = event.target;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  };
  //submit to end point
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(answers),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[curr];


  return (
    <div>
      {currentQuestion ?<div> {currentQuestion.question} </div>
      : <div>Loading</div>}
      <form onSubmit={(event) => event.preventDefault()}>
        <input
          // type={currentQuestion.type}
          placeholder='answer here'
          onChange={handleAnswerChange}
          // required={isMandatory}
         
    
        />
      </form>
      <div>
          {curr > 0 && (
            <Button type="button" onClick={handleBack}>
              Previous Question
            </Button>
          )}
          {curr < questions.length - 1 ? (
            <Button type="button" onClick={handleNext}
            required={isMandatory}>
              Next Question
            </Button>
          ) : (
            <Button  onClick={handleSubmit} disabled={isSubmitting}>
              Submit Question
            </Button>
          )}
        </div>
    </div>
  );
}


export default App;
