// no-tscheck
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
	AlertCircle,
	ChevronLeft,
	ChevronRight,
	HelpCircle,
	CheckCircle,
	Award,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import questionsData from '@/lib/questions.json';

interface Option {
	[key: string]: string;
}

interface Question {
	question_number: number;
	question_text: string;
	options: Option;
	correct_option: string;
	needs_photo: boolean;
	photo_url?: string;
	explanation: string;
}

interface UserAnswers {
	[key: number]: string;
}

const QuizApp = () => {
	const [questions] = useState<Question[]>(questionsData.questions);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
	const [showHint, setShowHint] = useState(false);
	const [showResults, setShowResults] = useState(false);

	const handleAnswer = (answer: string) => {
		setUserAnswers((prev) => ({
			...prev,
			[currentQuestion?.question_number]: answer,
		}));
	};

	const currentQuestion = questions[currentIndex];

	const calculateScore = () => {
		let correct = 0;
		const total = questions.length;
		questions.forEach((q) => {
			if (userAnswers[q.question_number] === q.correct_option) {
				correct++;
			}
		});
		return { correct, total, percentage: ((correct / total) * 100).toFixed(1) };
	};

	const getScoreColor = (percentage: number) => {
		if (percentage >= 80) return 'text-emerald-500';
		if (percentage >= 60) return 'text-amber-500';
		return 'text-rose-500';
	};

	const getProgressColor = () => {
		const answered = Object.keys(userAnswers).length;
		const total = questions.length;
		const progress = (answered / total) * 100;
		return `linear-gradient(90deg, #10b981 ${progress}%, #e2e8f0 ${progress}%)`;
	};

	if (!currentQuestion) return null;

	return (
		<div className='min-h-screen bg-gradient-to-br from-violet-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-4xl mx-auto'>
				{!showResults ? (
					<Card className='border-none shadow-xl bg-white/90 backdrop-blur'>
						<CardHeader className='border-b border-gray-100'>
							<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
								<div className='space-y-2 w-full'>
									<CardTitle className='text-xl sm:text-2xl font-bold text-violet-900'>
										Question {currentQuestion.question_number}
									</CardTitle>
									<div
										className='w-full h-2 rounded-full'
										style={{ background: getProgressColor() }}></div>
									<p className='text-sm text-gray-600'>
										{Object.keys(userAnswers).length} of {questions.length}{' '}
										questions answered
									</p>
								</div>
								<div className='flex gap-2 w-full sm:w-auto'>
									<Button
										variant='outline'
										className='flex-1 sm:flex-none hover:bg-violet-50'
										onClick={() => setShowHint(!showHint)}>
										<HelpCircle className='w-4 h-4 mr-2' />
										Hint
									</Button>
									<Button
										className='flex-1 sm:flex-none bg-violet-600 hover:bg-violet-700'
										onClick={() => setShowResults(true)}>
										<Award className='w-4 h-4 mr-2' />
										Results
									</Button>
								</div>
							</div>
						</CardHeader>
						<CardContent className='p-6'>
							<div className='space-y-6'>
								<div className='text-lg font-medium text-gray-800 break-words'>
									{currentQuestion.question_text}
								</div>

								{currentQuestion.needs_photo && (
									<div className='my-6'>
										<img
											src={`/images/questions/${currentQuestion.question_number}.png`}
											alt='Question visual'
											className='w-full max-w-2xl mx-auto rounded-xl shadow-lg'
										/>
									</div>
								)}

								<div className='space-y-3'>
									{Object.entries(currentQuestion.options).map(
										([key, value]) => {
											const isSelected =
												userAnswers[currentQuestion.question_number] === key;
											const isCorrect = currentQuestion.correct_option === key;
											const showCorrect =
												userAnswers[currentQuestion.question_number] &&
												isCorrect;
											const showIncorrect =
												userAnswers[currentQuestion.question_number] === key &&
												!isCorrect;

											return (
												<Button
													key={key}
													variant={isSelected ? 'default' : 'outline'}
													className={`w-full justify-start text-left p-4 break-words hover:bg-violet-50 text-wrap ${
														showCorrect
															? 'bg-emerald-50 border-emerald-200 text-emerald-900'
															: showIncorrect
															? 'bg-rose-50 border-rose-200 text-rose-900'
															: isSelected
															? 'bg-violet-100 border-violet-200'
															: ''
													}`}
													onClick={() => handleAnswer(key)}>
													<span className='font-bold mr-3 min-w-[1.5rem]'>
														{key.toUpperCase()}.
													</span>
													<span className='flex-1'>{value}</span>
													{showCorrect && (
														<CheckCircle className='w-5 h-5 ml-2 text-emerald-500' />
													)}
													{showIncorrect && (
														<AlertCircle className='w-5 h-5 ml-2 text-rose-500' />
													)}
												</Button>
											);
										}
									)}
								</div>

								{showHint && (
									<Alert className='bg-amber-50 border-amber-200 mt-6'>
										<HelpCircle className='text-amber-500' />
										<AlertDescription className='text-amber-800'>
											{currentQuestion.explanation}
										</AlertDescription>
									</Alert>
								)}

								<div className='flex justify-between mt-8 pt-4 border-t border-gray-100'>
									<Button
										variant='outline'
										onClick={() =>
											setCurrentIndex((prev) => Math.max(0, prev - 1))
										}
										disabled={currentIndex === 0}
										className='hover:bg-violet-50'>
										<ChevronLeft className='w-4 h-4 mr-2' /> Previous
									</Button>
									<Button
										onClick={() =>
											setCurrentIndex((prev) =>
												Math.min(questions.length - 1, prev + 1)
											)
										}
										disabled={currentIndex === questions.length - 1}
										className='bg-violet-600 hover:bg-violet-700'>
										Next <ChevronRight className='w-4 h-4 ml-2' />
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				) : (
					<Card className='border-none shadow-xl bg-white/90 backdrop-blur'>
						<CardHeader>
							<CardTitle className='text-2xl font-bold text-violet-900'>
								Quiz Results
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='space-y-8'>
								{(() => {
									const score = calculateScore();
									return (
										<div className='text-center space-y-6'>
											<div className='relative inline-block'>
												<div className='text-7xl font-bold'>
													<span
														className={getScoreColor(
															parseFloat(score?.percentage)
														)}>
														{score.percentage}%
													</span>
												</div>
												<Award className='absolute -top-4 -right-4 w-12 h-12 text-violet-500' />
											</div>
											<div className='text-xl text-gray-700'>
												You got {score.correct} out of {score.total} questions
												correct
											</div>
											<Button
												onClick={() => {
													setShowResults(false);
													setCurrentIndex(0);
												}}
												className='bg-violet-600 hover:bg-violet-700'>
												<CheckCircle className='w-4 h-4 mr-2' />
												Review Questions
											</Button>
										</div>
									);
								})()}

								<div className='mt-8'>
									<h3 className='text-xl font-bold text-gray-800 mb-4'>
										Question Summary
									</h3>
									<div className='grid gap-3'>
										{questions.map((q, idx) => (
											<div
												key={idx}
												className={`flex items-center justify-between p-4 rounded-lg border ${
													userAnswers[q.question_number] === q.correct_option
														? 'bg-emerald-50 border-emerald-200'
														: 'bg-rose-50 border-rose-200'
												}`}>
												<span className='font-medium'>
													Question {q.question_number}
												</span>
												<div className='flex items-center'>
													{userAnswers[q.question_number] ===
													q.correct_option ? (
														<span className='text-emerald-600 flex items-center'>
															<CheckCircle className='w-4 h-4 mr-2' /> Correct
														</span>
													) : (
														<span className='text-rose-600 flex items-center'>
															<AlertCircle className='w-4 h-4 mr-2' /> Incorrect
														</span>
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
};

export default QuizApp;
