import {
  Grid,
  Paper,
  Button,
  Radio,
  Typography,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@material-ui/core";

import { useState, useEffect } from "react";
import { createMarkup } from "../helpers";
import TotalResults from "./TotalResults";

const QuizAnswers = ({
  classes,
  quizData,
  resetQuiz,
  currentQuizStep,
  setCurrentQuizStep,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [processedAnswers, setProcessedAnswers] = useState([]);

  const handleResult = (e) => {
    e.preventDefault();

    const processedAnswers = selectedAnswers.map(({ answer, question }) => {
      const relatedQuestion = quizData.find(
        (category) => category.question === question
      );

      function getKeyByValue(object) {
        return Object.keys(object).find(key => object[key] === "true");
      }

      const allAnswers = relatedQuestion.correct_answers;
      const correctAnswer = getKeyByValue(allAnswers).replace('_correct','')
      const correctAnswerValue = relatedQuestion.answers[correctAnswer]

      if (correctAnswerValue === answer) {
        return { correctAnswer: answer, isCorrect: true, question };
      }
      else {
        return {
          correctAnswer: correctAnswerValue,
          wrongAnswer: answer,
          isCorrect: false,
          question,
        };
}
      
    });

    setProcessedAnswers(processedAnswers);
  };

  const handleAnswerChange = (e, selectedQuestion) => {
    e.preventDefault();
    const { value } = e.target;

    const doesQuestionExist =
      selectedAnswers.length &&
      selectedAnswers.find((answer) => answer.question === selectedQuestion);

    if (doesQuestionExist && doesQuestionExist.answer) {
      const updatedAnswers = selectedAnswers.map((answer) => {
        if (answer.question === selectedQuestion) {
          return { question: selectedQuestion, answer: value };
        }
        return answer;
      });
      setSelectedAnswers(updatedAnswers);
    } else {
      setSelectedAnswers([
        ...selectedAnswers,
        { question: selectedQuestion, answer: value },
      ]);
    }
  };

  const relatedAnswer = (question, selectedAnswers) => {
    if (selectedAnswers && selectedAnswers.length) {
      const relatedQuestion = selectedAnswers.find(
        (answer) => answer.question === question
      );
      return (relatedQuestion && relatedQuestion.answer) || "";
    }
    return "";
  };

  useEffect(() => {
    window.scrollTo(0, "20px");
  }, []);

  return !processedAnswers || !processedAnswers.length ? (
    <>
      <Typography variant="h1" className={classes.mainTitle}>
        Answer the following questions:
      </Typography>
      <form onSubmit={handleResult}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            {quizData.map((quiz) => (
              <Paper key={quiz.question} className={classes.paper}>
                <Typography variant="h5" className={classes.question}>
                  <span dangerouslySetInnerHTML={createMarkup(quiz.question)} />
                </Typography>
                <FormControl fullWidth variant="outlined" >
                  <RadioGroup
                    aria-label="Select answer"
                    name="answer"
                    id="answer-radio"
                    value={relatedAnswer(quiz.question, selectedAnswers) || ""}
                    onChange={(e) => handleAnswerChange(e, quiz.question)}
                  >
                    {Object.values(quiz.answers).filter(e => e !== null).map((answer) => (
                      <FormControlLabel key={answer} label={answer} value={answer} control={<Radio />}>
                        <span dangerouslySetInnerHTML={createMarkup(answer)} />
                      </FormControlLabel>
                    ))}
                  </RadioGroup>
                </FormControl>
              </Paper>
            ))}
            <Button
              className={classes.submitButton}
              variant="contained"
              color="primary"
              id="submit"
              type="submit"
              size="large"
            >
              FINISH
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  ) : (
    <TotalResults
      classes={classes}
      resetQuiz={resetQuiz}
      currentQuizStep={currentQuizStep}
      processedAnswers={processedAnswers}
      setCurrentQuizStep={setCurrentQuizStep}
    />
  );
};

export default QuizAnswers;
