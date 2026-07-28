import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { usePracticeStore, useAudioStore, useUIStore } from '@/stores';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { v4 as uuid } from 'uuid';
import { Mic, MicOff, Play, SkipForward, RotateCcw, BookOpen, ArrowLeft } from 'lucide-react';
import type { Sentence } from '@/models';

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export function SpeakSessionPage() {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();
  const { sentences, currentIndex, scores, isActive, startSession, nextSentence, prevSentence, recordScore, endSession, resetSession } = usePracticeStore();
  const { isRecording, setRecording } = useAudioStore();
  const { addToast } = useUIStore();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<InstanceType<typeof SpeechRecognition> | null>(null);

  const material = useLiveQuery(() => materialId ? db.materials.get(materialId) : null, [materialId]);
  const materialSentences = useLiveQuery(() =>
    materialId ? db.sentences.where('materialId').equals(materialId).sortBy('order') : null,
    [materialId]
  );

  useEffect(() => {
    if (materialSentences && material && !isActive) {
      startSession(material.id, materialSentences, 'speaking');
    }
    return () => { if (!isActive) resetSession(); };
  }, [materialSentences, material]);

  const currentSentence = sentences[currentIndex] as Sentence | undefined;

  const speakSentence = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, []);

  const startRecording = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addToast('您的浏览器不支持语音识别', 'error');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      // Simple score based on transcript match
      const refText = currentSentence?.text ?? '';
      const score = calculateSimpleScore(refText, result);
      recordScore(score);
      setRecording(false);
    };

    recognition.onerror = () => {
      addToast('语音识别出错，请重试', 'error');
      setRecording(false);
    };

    recognition.onend = () => setRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
    setTranscript('');
  }, [currentSentence, recordScore, setRecording, addToast]);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    setRecording(false);
  }, [setRecording]);

  const handleNext = () => {
    if (currentIndex < sentences.length - 1) {
      nextSentence();
      setTranscript('');
    } else {
      endSession();
    }
  };

  const handleFinish = () => {
    endSession();
    navigate('/speak');
    addToast('口语练习完成！', 'success');
  };

  if (!material || !currentSentence) return <LoadingSpinner className="py-20" />;

  const progress = ((currentIndex + (scores[currentIndex] > 0 ? 1 : 0)) / sentences.length) * 100;
  const avgScore = scores.filter(s => s > 0).length > 0
    ? Math.round(scores.filter(s => s > 0).reduce((a, b) => a + b, 0) / scores.filter(s => s > 0).length)
    : 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => { endSession(); navigate('/speak'); }}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="font-semibold">{material.title}</h2>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>句子 {currentIndex + 1}/{sentences.length}</span>
            {avgScore > 0 && <Badge variant={avgScore >= 80 ? 'success' : avgScore >= 60 ? 'warning' : 'danger'}>{avgScore}分</Badge>}
          </div>
        </div>
      </div>

      <ProgressBar value={progress} size="sm" />

      {/* Sentence Card */}
      <Card className="border-2 border-indigo-100 dark:border-indigo-900/50">
        <CardContent className="space-y-4 p-6">
          <p className="text-xl font-medium text-center">{currentSentence.text}</p>
          {currentSentence.translation && (
            <p className="text-sm text-slate-500 text-center">{currentSentence.translation}</p>
          )}
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={() => speakSentence(currentSentence.text)}
          disabled={isSpeaking || isRecording}
        >
          <Play className="h-5 w-5" />
          {isSpeaking ? '播放中...' : '播放原音'}
        </Button>

        <Button
          size="lg"
          variant={isRecording ? 'danger' : 'primary'}
          onClick={isRecording ? stopRecording : startRecording}
          className="h-16 w-16 rounded-full"
        >
          {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>

        <Button variant="outline" size="lg" onClick={() => { setTranscript(''); startRecording(); }} disabled={isRecording}>
          <RotateCcw className="h-5 w-5" />
          重录
        </Button>
      </div>

      {isRecording && (
        <p className="text-center text-sm text-red-500 animate-pulse">正在录音中...</p>
      )}

      {/* Transcript result */}
      {transcript && (
        <Card>
          <CardContent className="space-y-2 p-4">
            <p className="text-xs text-slate-500">识别结果：</p>
            <p className="text-sm">{transcript}</p>
            {scores[currentIndex] > 0 && (
              <p className="text-sm font-medium text-indigo-600">得分：{scores[currentIndex]}分</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={prevSentence} disabled={currentIndex === 0}>
          上一句
        </Button>
        <Button variant="ghost" onClick={() => { /* Save word placeholder */ addToast('已添加到词汇本', 'success'); }}>
          <BookOpen className="h-4 w-4 mr-1" /> 添加生词
        </Button>
        {currentIndex < sentences.length - 1 ? (
          <Button onClick={handleNext} disabled={scores[currentIndex] === 0}>
            下一句 <SkipForward className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={handleFinish} disabled={scores[currentIndex] === 0}>
            完成练习
          </Button>
        )}
      </div>
    </div>
  );
}

function calculateSimpleScore(reference: string, transcript: string): number {
  const refWords = reference.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
  const transWords = transcript.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/);
  if (refWords.length === 0) return 0;
  const matched = refWords.filter(w => transWords.includes(w)).length;
  const accuracy = matched / refWords.length;
  return Math.round(accuracy * 100);
}
