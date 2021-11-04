import {
  Grid,
  Paper,
  Select,
  MenuItem,
  TextField,
  Container,
  Typography,
  InputLabel,
  FormControl,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useState, useEffect } from "react";
import { styles, difficulties, createMarkup } from "../helpers";
import QuizAnswers from "./QuizAnswers";

const useStyles = makeStyles(() => {
  return styles;
});

const QuizFilters = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({ id: "", name: "" });

  const [quizNumber, setQuizNumber] = useState(null);
  const [difficulty, setDifficulty] = useState({ id: "", name: "" });

  const [quizData, setQuizData] = useState([]);
  const classes = useStyles();

  const [currentQuizStep, setCurrentQuizStep] = useState("start");

  const fetchQuizData = async () => {
    try {
      let url = '';
      category.name !== 'Random' || 'uncategorized'
        ? url = `https://quizapi.io/api/v1/questions?apiKey=${process.env.REACT_APP_API_KEY}&category=${category.name}&difficulty=${difficulty.name}&limit=${quizNumber}`  
        : url = `https://quizapi.io/api/v1/questions?apiKey=${process.env.REACT_APP_API_KEY}&difficulty=${difficulty.name}&limit=${quizNumber}`;

      const { data } = await axios.get(url);
      setQuizData(data);
      setCurrentQuizStep("results");

    } catch (error) {
      console.log("Fetch quiz error =====>>>>", error);
    }
  };

  const fetchCategories = async () => {
    const { data } = await axios.get(`https://quizapi.io/api/v1/questions?apiKey=rVdLWKRMhzDn6n2k5ZlbQmMsSQS7hAjslZ624hWk`);
    const helperArr = [];
    
    data.map((el) => {
      let subsetCategoryAndId = (({ id, category }) => ({ id, category}))(el);

      subsetCategoryAndId[ 'name' ] = subsetCategoryAndId[ 'category' ];

      if (subsetCategoryAndId.category === ''){
        subsetCategoryAndId.name = 'Random'
      }
      return helperArr.push(subsetCategoryAndId);
    })

    const uniqueHelperArr = helperArr.reduce((unique, o) => {
      if(!unique.some(obj => obj.category === o.category)) {
        unique.push(o);
      }
      return unique;
  },[]);

    setCategories(uniqueHelperArr)
  };

  useEffect(() => {
    fetchCategories();
    window.scrollTo(0, "20px");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quizData.length && quizNumber && category.id && difficulty) {
      fetchQuizData();
    }
  };

  const handleSelectChange = (e) => {
    e.preventDefault();
    const selectedCategory = categories.find(
      (cat) => cat.id === e.target.value
    );
    setCategory(selectedCategory);
  };

  const handleDifficultyChange = (e) => {
    e.preventDefault();
    const selectedDifficulty = difficulties.find(
      (diff) => diff.id === e.target.value
    );
    setDifficulty(selectedDifficulty);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setQuizNumber(e.target.value);
  };

  const resetQuiz = (e) => {
    e.preventDefault();
    setQuizData([]);
    setCategory("");
    setQuizNumber("");
    setDifficulty("");
    setCurrentQuizStep("start");
    window.scrollTo(0, "20px");
  };

  if (!categories.length) {
    return null;
  }

  return (
    <Container>
      <Paper className={classes.paper}>
        {currentQuizStep === "start" ? (
          <>
            <Typography variant="h1" className={classes.mainTitle}>
              Test your skills:
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="category-select-label">
                      Select a category:
                    </InputLabel>
                    <Select
                      required
                      name="category"
                      value={category.id || ""}
                      id="category-select"
                      label="Select a category"
                      labelId="category-select-label"
                      onChange={handleSelectChange}
                    >
                      {categories.map((category) => (
                        <MenuItem className="select-menu" key={category.id} value={category.id}>
                          <span
                            dangerouslySetInnerHTML={createMarkup(
                              category.name
                            )}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="difficulty-select-label">
                      Select a level of difficulty:
                    </InputLabel>
                    <Select
                      required
                      name="difficulty"
                      value={difficulty.id || ""}
                      id="difficulty-select"
                      label="Select a level of difficulty"
                      labelId="difficulty-select-label"
                      onChange={handleDifficultyChange}
                    >
                      {difficulties.map((difficulty) => (
                        <MenuItem key={difficulty.id} value={difficulty.id}>
                          {difficulty.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    inputProps={{ min: 1, max: 10 }}
                    required
                    fullWidth
                    type="number"
                    id="quiz-number"
                    variant="outlined"
                    name="quiz-number"
                    label={`Number of questions (1-10):`}
                    value={quizNumber || ""}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Button
              className={classes.submitButton}
              variant="contained"
              color="primary"
              type="submit"
              size="large"
            >
              START
            </Button>

            </form>
          </>
        ) : (
          <QuizAnswers
            classes={classes}
            quizData={quizData}
            resetQuiz={resetQuiz}
            categories={categories}
            currentQuizStep={currentQuizStep}
            setCurrentQuizStep={setCurrentQuizStep}
          />
        )}
      </Paper>
    </Container>
  );
};

export default QuizFilters;