import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { usePracticeStore, useUIStore } from '@/stores';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { v4 as uuid } from 'uuid';
import { Play, ArrowLeft, Check, X } from 'lucide-react';
import type { Sentence } from '@/models';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  sentenceIndex: number;
}

export function ListenSessionPage() {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();
  const { sentences, currentIndex, scores, isActive, startSession, nextSentence, recordScore, endSession, resetSession } = usePracticeStore();
  const { addToast } = useUIStore();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answers, setAnswers] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  const material = useLiveQuery(() => materialId ? db.materials.get(materialId) : null, [materialId]);
  const materialSentences = useLiveQuery(() =>
    materialId ? db.sentences.where('materialId').equals(materialId).sortBy('order') : null,
    [materialId]
  );

  useEffect(() => {
    if (materialSentences && material && !isActive) {
      startSession(material.id, materialSentences, 'listening');
    }
    return () => { if (!isActive) resetSession(); };
  }, [materialSentences, material]);

  useEffect(() => {
    if (sentences.length > 0 && questions.length === 0) {
      const generated = generateQuestions(sentences);
      setQuestions(generated);
    }
  }, [sentences]);

  const currentQuestion = questions[currentIndex];
  const currentSentence = sentences[currentIndex] as Sentence | undefined;

  const speakText = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    const isCorrect = answer === currentQuestion?.correctAnswer;
    if (isCorrect) {
      setAnswers(prev => ({ ...prev, correct: prev.correct + 1 }));
      recordScore(100);
    } else {
      recordScore(0);
    }
    setAnswers(prev => ({ ...prev, total: prev.total + 1 }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setSelectedAnswer(null);
      setShowResult(false);
      nextSentence();
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    const finalScore = answers.total > 0 ? Math.round((answers.correct / answers.total) * 100) : 0;
    const session = {
      id: uuid(),
      materialId: materialId!,
      score: finalScore,
      totalQuestions: answers.total,
      correctAnswers: answers.correct,
      duration: 0,
      completedAt: Date.now(),
    };
    await db.listeningSessions.put(session);
    endSession();
    navigate('/listen');
    addToast(`听力练习完成！得分：${finalScore}分`, 'success');
  };

  if (!material || !currentQuestion || !currentSentence) return <LoadingSpinner className="py-20" />;

  const progress = ((currentIndex + (showResult ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => { endSession(); navigate('/listen'); }}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="font-semibold">{material.title}</h2>
          <p className="text-xs text-slate-500">问题 {currentIndex + 1}/{questions.length}</p>
        </div>
        <Badge variant="primary">{answers.correct}/{answers.total}</Badge>
      </div>

      <ProgressBar value={progress} size="sm" />

      {/* Audio player */}
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <Button
            variant={isPlaying ? 'secondary' : 'primary'}
            onClick={() => speakText(currentSentence.text)}
            className="h-12 w-12 rounded-full"
          >
            <Play className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-sm font-medium">听句子，回答问题</p>
            <p className="text-xs text-slate-500">可以多次播放</p>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="border-2 border-emerald-100 dark:border-emerald-900/50">
        <CardContent className="space-y-4 p-6">
          <p className="text-lg font-medium">{currentQuestion.question}</p>

          <div className="space-y-2">
            {currentQuestion.options.map((option, i) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === currentQuestion.correctAnswer;
              let variant: 'outline' | 'primary' | 'danger' | 'secondary' = 'outline';

              if (showResult) {
                if (isCorrect) variant = 'primary';
                else if (isSelected && !isCorrect) variant = 'danger';
                else variant = 'secondary';
              } else if (isSelected) {
                variant = 'primary';
              }

              return (
                <Button
                  key={i}
                  variant={variant}
                  className="w-full justify-start text-left"
                  onClick={() => handleSelect(option)}
                  disabled={showResult}
                >
                  {showResult && isCorrect && <Check className="h-4 w-4 mr-2 text-emerald-500" />}
                  {showResult && isSelected && !isCorrect && <X className="h-4 w-4 mr-2 text-red-500" />}
                  <span>{option}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {showResult && (
        <div className="text-center">
          <p className={selectedAnswer === currentQuestion.correctAnswer ? 'text-emerald-600 font-medium' : 'text-red-600 font-medium'}>
            {selectedAnswer === currentQuestion.correctAnswer ? '✅ 回答正确！' : `❌ 正确答案：${currentQuestion.correctAnswer}`}
          </p>
          <Button className="mt-3" onClick={handleNext}>
            {currentIndex < questions.length - 1 ? '下一题' : '查看结果'}
          </Button>
        </div>
      )}
    </div>
  );
}

function generateQuestions(sentences: Sentence[]): QuizQuestion[] {
  // Generate simple comprehension questions from sentences
  // For each sentence, ask a simple question about its content
  return sentences.slice(0, 10).map((sentence, idx) => {
    const words = sentence.text.split(' ');
    const keyWord = words.length > 3 ? words[Math.floor(words.length / 2)] : words[words.length - 1] || 'the';

    const question = `What word was mentioned: "${keyWord}" or "something else"?`;
    const distractors = generateDistractors(keyWord);

    return {
      question: `句子 ${idx + 1}: "${sentence.text.slice(0, 60)}${sentence.text.length > 60 ? '...' : ''}" — 哪个词在句子中出现了？`,
      options: shuffleArray([keyWord, ...distractors]),
      correctAnswer: keyWord,
      sentenceIndex: idx,
    };
  });
}

function generateDistractors(word: string): string[] {
  const commonWords = ['really', 'always', 'never', 'quickly', 'simply', 'actually', 'probably', 'usually'];
  return commonWords.filter(w => w !== word.toLowerCase()).slice(0, 3);
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
