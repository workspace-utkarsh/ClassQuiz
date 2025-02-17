/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

export interface QuizData {
	title: string;
	description: string;
	quiz_id: string;
	questions: Question[];
	game_id: string;
	game_pin: string;
	started: boolean;
	cover_image?: string;
	background_color?: string;
}

export enum QuizQuestionType {
	ABCD = 'ABCD', // eslint-disable-line no-unused-vars
	RANGE = 'RANGE', // eslint-disable-line no-unused-vars
	VOTING = 'VOTING' // eslint-disable-line no-unused-vars
}

export interface RangeQuizAnswer {
	min: number;
	max: number;
	min_correct: number;
	max_correct: number;
}

export interface Question {
	time: string;
	question: string;
	type?: QuizQuestionType;
	image?: string;
	answers: Answer[] | RangeQuizAnswer | VotingAnswer[];
}

export interface Answer {
	right: boolean;
	answer: string;
	color?: string;
}
export interface VotingAnswer {
	answer: string;
	image?: string;
	color?: string;
}

export interface EditorData {
	public: boolean;
	title: string;
	description: string;
	questions: Question[];
	cover_image?: string;
	background_color?: string;
}
