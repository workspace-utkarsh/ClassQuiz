<!--suppress ALL -->
<script lang="ts">
	import { socket } from '$lib/socket';
	import JoinGame from '$lib/play/join.svelte';
	import type { Answer, Question as QuestionType } from '$lib/quiz_types';
	import ShowTitle from '$lib/play/title.svelte';
	import Question from '$lib/play/question.svelte';
	import ShowResults from '$lib/play/show_results.svelte';
	import { navbarVisible } from '$lib/stores';
	import ShowEndScreen from '$lib/play/end.svelte';
	import KahootResults from '$lib/play/results_kahoot.svelte';
	import { getLocalization } from '$lib/i18n';
	import Cookies from 'js-cookie';

	const { t } = getLocalization();

	// Exports
	export let data;
	let { game_pin } = data;

	// Types
	interface GameMeta {
		started: boolean;
	}

	let game_mode;
	let final_results: Array<null> | Array<Array<PlayerAnswer>> = [null];

	interface PlayerAnswer {
		username: string;
		answer: string;
		right: string;
	}

	// Variables init
	let question_index = '';
	let unique = {};
	navbarVisible.set(false);
	let game_pin_valid: boolean;
	let answer_results: Array<Answer>;
	let gameData;
	let solution: QuestionType;
	let username = '';
	let scores = {};
	let gameMeta: GameMeta = {
		started: false
	};

	let question;

	let preventReload = true;

	// Functions
	function restart() {
		unique = {};
	}

	const confirmUnload = () => {
		if (preventReload) {
			event.preventDefault();
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			event.returnValue = '';
		}
	};

	socket.on('time_sync', (data) => {
		socket.emit('echo_time_sync', data);
	});

	// Socket-events
	socket.on('joined_game', (data) => {
		gameData = data;
		// eslint-disable-next-line no-undef
		plausible('Joined Game', { props: { quiz_id: gameData.quiz_id } });
	});

	socket.on('game_not_found', () => {
		game_pin_valid = false;
	});

	socket.on('set_question_number', (data) => {
		solution = undefined;
		restart();
		question = data.question;
		question_index = data.question_index;
		answer_results = undefined;
	});

	socket.on('start_game', () => {
		gameMeta.started = true;
	});

	socket.on('question_results', (data) => {
		restart();
		try {
			answer_results = JSON.parse(data);
		} catch {
			answer_results = null;
		}
	});

	socket.on('username_already_exists', () => {
		window.alert('Username already exists!');
	});

	socket.on('kick', () => {
		window.alert('You got kicked');
		preventReload = false;
		game_pin = '';
		username = '';
		Cookies.set('kicked', 'value', { expires: 1 });
		window.location.reload();
	});
	socket.on('final_results', (data) => {
		final_results = data;
	});

	socket.on('solutions', (data) => {
		solution = data;
	});

	let bg_color;
	$: bg_color = gameData ? gameData.background_color : undefined;
	// The rest
</script>

<!--
  - This Source Code Form is subject to the terms of the Mozilla Public
  - License, v. 2.0. If a copy of the MPL was not distributed with this
  - file, You can obtain one at https://mozilla.org/MPL/2.0/.
  -->

<svelte:window on:beforeunload={confirmUnload} />
<svelte:head>
	<title>ClassQuiz - Play</title>
	<!--	{#if gameData !== undefined && game_mode !== 'kahoot'}
		{#each gameData.questions as question}
			{#if question.image !== undefined}
				<link rel="preload" as="image" href={question.image} />
			{/if}
		{/each}
	{/if}-->
</svelte:head>
<div
	class="min-h-screen min-w-full"
	style="background: {bg_color ? bg_color : 'transparent'}"
	class:text-black={bg_color}
>
	<div>
		{#if !gameMeta.started && gameData === undefined}
			<JoinGame {game_pin} bind:game_mode bind:username />
		{:else if JSON.stringify(final_results) !== JSON.stringify([null])}
			<ShowEndScreen bind:final_results bind:question_count={gameData.question_count} />
		{:else if gameData !== undefined && question_index === ''}
			<ShowTitle
				bind:title={gameData.title}
				bind:description={gameData.description}
				bind:cover_image={gameData.cover_image}
			/>
		{:else if gameMeta.started && gameData !== undefined && question_index !== '' && answer_results === undefined}
			{#key unique}
				<div class="text-black dark:text-black">
					<Question bind:game_mode bind:question bind:question_index bind:solution />
				</div>
			{/key}
		{:else if gameMeta.started && answer_results !== undefined}
			{#if answer_results === null}
				<div class="w-full flex justify-center">
					<h1 class="text-3xl">{$t('admin_page.no_answers')}</h1>
				</div>
			{:else if game_mode === 'kahoot'}
				<div>
					<h2 class="text-center text-3xl mb-8">{$t('words.result', { count: 2 })}</h2>
				</div>
				{#key unique}
					<KahootResults
						bind:username
						bind:question_results={answer_results}
						bind:scores
					/>
				{/key}
			{:else}
				{#key unique}
					<ShowResults
						bind:results={answer_results}
						bind:game_data={gameData}
						bind:question_index
						bind:solution
					/>
				{/key}
			{/if}
		{/if}
	</div>
</div>
