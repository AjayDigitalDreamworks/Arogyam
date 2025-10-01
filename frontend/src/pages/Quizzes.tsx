import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, GamepadIcon, Trophy, Clock, Play, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import API_BASE_URL from "@/config/api";

const quizzes = [
  {
    id: "phq9",
    title: "PHQ-9 Depression Screening",
    description:
      "Patient Health Questionnaire-9 to assess depression symptoms over the last 2 weeks",
    duration: "3-5 minutes",
    questions: 9,
    category: "Mental Health",
    difficulty: "Clinical",
    icon: "🧠",
    color: "bg-blue-500",
    completed: false,
    questions_data: [
      "Little interest or pleasure in doing things",
      "Feeling down, depressed, or hopeless",
      "Trouble falling or staying asleep, or sleeping too much",
      "Feeling tired or having little energy",
      "Poor appetite or overeating",
      "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
      "Trouble concentrating on things, such as reading the newspaper or watching television",
      "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
      "Thoughts that you would be better off dead or of hurting yourself in some way",
    ],
  },
  {
    id: "gad7",
    title: "GAD-7 Anxiety Assessment",
    description:
      "Generalized Anxiety Disorder 7-item scale to measure anxiety symptoms over the last 2 weeks",
    duration: "2-4 minutes",
    questions: 7,
    category: "Mental Health",
    difficulty: "Clinical",
    icon: "💚",
    color: "bg-green-500",
    completed: false,
    questions_data: [
      "Feeling nervous, anxious or on edge",
      "Not being able to stop or control worrying",
      "Worrying too much about different things",
      "Trouble relaxing",
      "Being so restless that it is hard to sit still",
      "Becoming easily annoyed or irritable",
      "Feeling afraid as if something awful might happen",
    ],
  },
];

const games = [
  {
    id: "1",
    title: "Mindful Breathing",
    description: "Interactive breathing exercise game to reduce stress",
    duration: "2-5 minutes",
    type: "Relaxation Game",
    icon: "🫁",
    color: "bg-cyan-500",
    highScore: null,
  },
  {
    id: "2",
    title: "Gratitude Garden",
    description: "Plant virtual flowers by reflecting on positive moments",
    duration: "5-10 minutes",
    type: "Mindfulness Game",
    icon: "🌻",
    color: "bg-yellow-500",
    highScore: 89,
  },
  {
    id: "3",
    title: "Emotion Color Match",
    description: "Match colors to emotions to build emotional awareness",
    duration: "3-7 minutes",
    type: "Educational Game",
    icon: "🎨",
    color: "bg-pink-500",
    highScore: 156,
  },
  {
    id: "4",
    title: "Stress Ball Squeeze",
    description: "Digital stress relief through interactive squeezing motions",
    duration: "1-3 minutes",
    type: "Quick Relief",
    icon: "⚡",
    color: "bg-red-500",
    highScore: null,
  },
];

const questionOptions = [
  "Not at all",
  "Several days",
  "More than half the days",
  "Nearly every day",
];

export default function Quizzes() {
  const [activeQuiz, setActiveQuiz] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizProgress, setQuizProgress] = useState(0);
  const { toast } = useToast();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/current_user`, { withCredentials: true })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
      });
  }, []);

  const sendQuizScore = async (userId: string, score: number, quiz_type: string, date: Date = new Date()) => {
    try {
      await axios.post(`${API_BASE_URL}/api/quiz`, {
        userId,
        score,
        quiz_type,
        date
      }, { withCredentials: true });
      console.log("Quiz score submitted!");
    } catch (error) {
      console.error("Error submitting quiz score:", error);
    }
  };

  const startQuiz = (quiz: any) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setQuizProgress(0);
    setSelectedAnswer("");
    setAnswers([]);
  };

  const nextQuestion = () => {
    if (selectedAnswer === "") {
      toast({ title: "Please select an answer", description: "Choose an option before proceeding.", variant: "destructive" });
      return;
    }

    const newAnswers = [...answers, parseInt(selectedAnswer)];
    setAnswers(newAnswers);

    if (currentQuestion + 1 >= activeQuiz.questions) {
      const totalScore = newAnswers.reduce((sum, score) => sum + score, 0);
      const quizType = activeQuiz.id === "phq9" ? "depression" : "anxiety";
      if (user) sendQuizScore(user._id, totalScore, quizType);

      toast({ title: "Assessment Completed!", description: `Total score: ${totalScore}. View your results and recommendations.` });
      setActiveQuiz(null);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setQuizProgress(((currentQuestion + 1) / activeQuiz.questions) * 100);
    }

    setSelectedAnswer("");
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
      setSelectedAnswer("");
      setQuizProgress((currentQuestion / activeQuiz.questions) * 100);
    }
  };

  const startGame = (game: any) => {
    toast({ title: `Starting ${game.title}`, description: "Game is loading... Have fun!" });
  };

  if (activeQuiz) {
    const currentQuestionText = activeQuiz.questions_data[currentQuestion];
    return (
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{activeQuiz.title}</h1>
            <Button variant="outline" onClick={() => setActiveQuiz(null)}>Exit Assessment</Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {activeQuiz.questions}</span>
              <span>{Math.round(quizProgress)}% Complete</span>
            </div>
            <Progress value={quizProgress} className="h-2" />
          </div>
        </div>
        <Card className="wellness-card p-8">
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-4">
              Over the last 2 weeks, how often have you been bothered by the following problem?
            </p>
          </div>

          <h2 className="text-xl font-semibold mb-6">{currentQuestion + 1}. {currentQuestionText}</h2>

          <div className="space-y-3 mb-8">
            {questionOptions.map((option, index) => (
              <button key={index} onClick={() => setSelectedAnswer(index.toString())} className={`w-full p-4 text-left rounded-lg border-2 transition-all ${selectedAnswer === index.toString() ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  <span className="text-sm text-muted-foreground">{index}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={previousQuestion} disabled={currentQuestion === 0}>Previous</Button>
            <Button onClick={nextQuestion}>
              {currentQuestion + 1 >= activeQuiz.questions ? "Complete Assessment" : "Next Question"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Quizzes & Games</h1>
        <p className="text-muted-foreground">Fun self-assessments and stress relief activities to support your mental wellness journey</p>
      </div>
      <Tabs defaultValue="quizzes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-2">
          <TabsTrigger value="quizzes" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Self-Assessments
          </TabsTrigger>
          <TabsTrigger value="games" className="flex items-center gap-2">
            <GamepadIcon className="w-4 h-4" />
            Wellness Games
          </TabsTrigger>
        </TabsList>
        <TabsContent value="quizzes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="wellness-card p-6 hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-full ${quiz.color} flex items-center justify-center text-2xl`}>
                    {quiz.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{quiz.category}</Badge>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{quiz.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{quiz.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" /> {quiz.duration}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Trophy className="w-3 h-3" /> {quiz.questions} questions
                  </div>
                </div>
                <Button onClick={() => startQuiz(quiz)} className="w-full">
                  <Play className="w-4 h-4 mr-2" /> Start Quiz
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="games" className="space-y-6">
          {/* Render games here */}
        </TabsContent>
      </Tabs>
    </div>
  );
}
