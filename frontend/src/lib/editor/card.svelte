<!--
  - This Source Code Form is subject to the terms of the Mozilla Public
  - License, v. 2.0. If a copy of the MPL was not distributed with this
  - file, You can obtain one at https://mozilla.org/MPL/2.0/.
  -->
<script lang="ts">
	import type { EditorData } from '$lib/quiz_types';
	import { QuizQuestionType } from '$lib/quiz_types';
	import RangeEditor from '$lib/editor/RangeSelectorEditorPart.svelte';
	import { reach } from 'yup';
	import { dataSchema } from '$lib/yupSchemas';
	import Spinner from '../Spinner.svelte';
	import { createTippy } from 'svelte-tippy';
	import { getLocalization } from '$lib/i18n';

	const { t } = getLocalization();

	const tippy = createTippy({
		arrow: true,
		animation: 'perspective-subtle',
		placement: 'top'
	});

	export let data: EditorData;
	export let selected_question: number;
	export let edit_id: string;
	export let pow_data;
	export let pow_salt: string;

	let uppyOpen = false;

	/*eslint no-unused-vars: ["error", { "argsIgnorePattern": "^_" }]*/
	const correctTimeInput = (_) => {
		let time = data.questions[selected_question].time;
		if (time === null || time === undefined) {
			data.questions[selected_question].time = '';
			time = '';
		}
		if (data.questions[selected_question].time > 3) {
			data.questions[selected_question].time = data.questions[selected_question].time
				.toString()
				.slice(0, 3);
		}
	};
	$: correctTimeInput(data.questions[selected_question].time);
	/*
	if (typeof data.questions[selected_question].type !== QuizQuestionType) {
		console.log(data.questions[selected_question].type !== QuizQuestionType.ABCD || data.questions[selected_question].type !== QuizQuestionType.RANGE)
		data.questions[selected_question].type = QuizQuestionType.ABCD;
	}
	 */
</script>

<div class="w-full h-full pb-20 px-20">
	<div class="rounded-lg bg-white w-full h-full border-gray-500 drop-shadow-2xl dark:bg-gray-700">
		<div class="h-fit bg-gray-300 rounded-t-lg dark:bg-gray-500">
			<div class="flex align-middle p-4 gap-3">
				<span
					class="inline-block bg-gray-600 w-4 h-4 rounded-full hover:bg-red-400 transition"
				/>
				<span
					class="inline-block bg-gray-600 w-4 h-4 rounded-full hover:bg-yellow-400 transition"
				/>
				<span
					class="inline-block bg-gray-600 w-4 h-4 rounded-full hover:bg-green-400 transition"
				/>
			</div>
		</div>
		<div class="flex flex-col">
			<div class="flex justify-center pt-10 w-full">
				<input
					type="text"
					bind:value={data.questions[selected_question].question}
					placeholder="No title..."
					class="p-3 rounded-lg border-gray-500 border text-center w-2/3 text-lg font-semibold placeholder:italic placeholder:font-normal dark:bg-gray-500"
					class:bg-yellow-500={!reach(dataSchema, 'questions[].question').isValidSync(
						data.questions[selected_question].question
					)}
				/>
			</div>
			{#if data.questions[selected_question].image != undefined && data.questions[selected_question].image !== ''}
				<div class="flex justify-center pt-10 w-full max-h-72 w-full">
					<img
						src={data.questions[selected_question].image}
						alt="not available"
						class="max-h-72 h-auto w-auto"
						on:contextmenu|preventDefault={() => {
							data.questions[selected_question].image = '';
						}}
					/>
				</div>
			{:else if pow_data === undefined}
				<a
					href="/docs/pow"
					target="_blank"
					use:tippy={{ content: "Click to learn why it's loading so long." }}
					class="cursor-help"
				>
					<Spinner my_20={false} />
				</a>
			{:else}
				{#await import('$lib/editor/uploader.svelte')}
					<Spinner my_20={false} />
				{:then c}
					<svelte:component
						this={c.default}
						bind:modalOpen={uppyOpen}
						bind:edit_id
						bind:data
						bind:selected_question
						bind:pow_data
						bind:pow_salt
					/>
				{/await}
			{/if}
			<div class="flex justify-center pt-10 w-full">
				<div>
					<svg
						class="w-8 h-8 inline-block"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<input
						type="number"
						max="999"
						min="1"
						class="w-20 bg-transparent rounded-lg text-lg border-2 border-gray-500 p-1"
						bind:value={data.questions[selected_question].time}
					/>
				</div>
			</div>
			<div class="flex justify-center pt-10">
				<select
					class="p-2 rounded-lg bg-gray-800 focus:ring-2 ring-blue-600 text-white"
					name="Answer-Type"
					bind:value={data.questions[selected_question].type}
				>
					<option value={QuizQuestionType.RANGE}>{$t('words.range')}</option>
					<option value={QuizQuestionType.ABCD}>{$t('words.multiple_choice')}</option>
					<option value={QuizQuestionType.VOTING}>{$t('words.voting')}</option>
				</select>
			</div>
			<div class="flex justify-center pt-10 w-full">
				{#if data.questions[selected_question].type === QuizQuestionType.ABCD}
					{#await import('$lib/editor/ABCDEditorPart.svelte')}
						<Spinner my_20={false} />
					{:then c}
						<svelte:component this={c.default} bind:data bind:selected_question />
					{/await}
				{:else if data.questions[selected_question].type === QuizQuestionType.RANGE}
					<RangeEditor bind:selected_question bind:data />
				{:else if data.questions[selected_question].type === QuizQuestionType.VOTING}
					{#await import('$lib/editor/VotingEditorPart.svelte')}
						<Spinner my_20={false} />
					{:then c}
						<svelte:component this={c.default} bind:data bind:selected_question />
					{/await}
				{/if}
			</div>
			<p class="italic text-center mt-auto pt-4">{$t('editor_page.right_click_to_delete')}</p>
		</div>
	</div>
</div>
