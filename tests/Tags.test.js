import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import TagsWrapper from './TagsWrapper.svelte';

function pressEnter(element) {
	fireEvent.keyDown(element, { key: 'Enter', keyCode: 13, which: 13 });
}

function pressBackspace(element) {
	fireEvent.keyDown(element, { key: 'Backspace', keyCode: 8, which: 8 });
}

describe('Tags', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('Rendering', () => {
		it('renders empty input with placeholder', () => {
			const { container } = render(TagsWrapper, {
				props: {
					tags: [],
					placeholder: 'Add tags...',
				},
			});

			const input = container.querySelector('.svelte-tags-input');
			expect(input).toBeTruthy();
			expect(input.placeholder).toBe('Add tags...');
		});

		it('renders existing tags', () => {
			render(TagsWrapper, {
				props: {
					tags: ['tag1', 'tag2'],
					placeholder: '',
				},
			});

			expect(screen.getByText('tag1')).toBeTruthy();
			expect(screen.getByText('tag2')).toBeTruthy();
		});
	});

	describe('Add tag', () => {
		it('typing + Enter adds tag to tags array', async () => {
			const user = userEvent.setup();
			const tags = [];
			const { container } = render(TagsWrapper, {
				props: { tags, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			await user.type(input, 'newtag');
			pressEnter(input);

			expect(screen.getByText('newtag')).toBeTruthy();
		});

		it('does not add empty tag on Enter', async () => {
			const user = userEvent.setup();
			const tags = [];
			const { container } = render(TagsWrapper, {
				props: { tags, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			await user.click(input);
			pressEnter(input);

			expect(container.querySelectorAll('.svelte-tags-input-tag')).toHaveLength(0);
		});
	});

	describe('Remove tag', () => {
		it('Backspace on empty input removes last tag', async () => {
			const user = userEvent.setup();
			const tags = ['tag1', 'tag2'];
			const { container } = render(TagsWrapper, {
				props: { tags, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			await user.click(input);
			pressBackspace(input);

			expect(screen.queryByText('tag2')).toBeNull();
			expect(screen.getByText('tag1')).toBeTruthy();
		});

		it('clicking remove button removes tag', async () => {
			const user = userEvent.setup();
			const tags = ['tag1', 'tag2'];
			const { container } = render(TagsWrapper, {
				props: { tags, placeholder: '' },
			});

			const removeButtons = container.querySelectorAll('.svelte-tags-input-tag-remove');
			await user.click(removeButtons[1]); // Remove tag2

			expect(screen.queryByText('tag2')).toBeNull();
			expect(screen.getByText('tag1')).toBeTruthy();
		});
	});

	describe('maxTags', () => {
		it('stops adding when maxTags reached', async () => {
			const user = userEvent.setup();
			const tags = ['tag1', 'tag2'];
			const { container } = render(TagsWrapper, {
				props: { tags, maxTags: 2, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			await user.type(input, 'tag3');
			pressEnter(input);

			expect(screen.queryByText('tag3')).toBeNull();
			expect(screen.getByText('tag1')).toBeTruthy();
			expect(screen.getByText('tag2')).toBeTruthy();
		});
	});

	describe('onlyUnique', () => {
		it('rejects duplicate tags', async () => {
			const user = userEvent.setup();
			const tags = ['existing'];
			const { container } = render(TagsWrapper, {
				props: { tags, onlyUnique: true, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			await user.type(input, 'existing');
			pressEnter(input);

			const existingTags = screen.getAllByText('existing');
			expect(existingTags).toHaveLength(1);
		});
	});

	describe('allowPaste', () => {
		it('pasted comma-separated text adds multiple tags', async () => {
			const user = userEvent.setup();
			const tags = [];
			const { container } = render(TagsWrapper, {
				props: { tags, allowPaste: true, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			await user.click(input);
			await user.paste('tag1, tag2, tag3');

			expect(screen.getByText('tag1')).toBeTruthy();
			expect(screen.getByText('tag2')).toBeTruthy();
			expect(screen.getByText('tag3')).toBeTruthy();
		});
	});

	describe('disable/readonly', () => {
		it('input disabled when disable=true', () => {
			const { container } = render(TagsWrapper, {
				props: { tags: [], disable: true, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			expect(input.disabled).toBe(true);
		});

		it('input disabled when readonly=true', () => {
			const { container } = render(TagsWrapper, {
				props: { tags: [], readonly: true, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			expect(input.disabled).toBe(true);
		});

		it('remove buttons hidden when disable=true', () => {
			const { container } = render(TagsWrapper, {
				props: { tags: ['tag1'], disable: true, placeholder: '' },
			});

			const removeButtons = container.querySelectorAll('.svelte-tags-input-tag-remove');
			expect(removeButtons).toHaveLength(0);
		});

		it('remove buttons hidden when readonly=true', () => {
			const { container } = render(TagsWrapper, {
				props: { tags: ['tag1'], readonly: true, placeholder: '' },
			});

			const removeButtons = container.querySelectorAll('.svelte-tags-input-tag-remove');
			expect(removeButtons).toHaveLength(0);
		});
	});

	describe('autoComplete', () => {
		it('shows dropdown when typing and selects with Enter', async () => {
			const user = userEvent.setup();
			const tags = [];
			const suggestions = ['Apple', 'Apricot', 'Banana'];
			const { container } = render(TagsWrapper, {
				props: {
					tags,
					autoComplete: suggestions,
					placeholder: '',
					minChars: 1,
					autoCompleteStartFocused: true,
				},
			});

			const input = container.querySelector('.svelte-tags-input');
			await user.type(input, 'Ap');

			expect(container.textContent).toContain('Apple');
			expect(container.textContent).toContain('Apricot');

			pressEnter(input);

			expect(container.textContent).toContain('Apple');
		});
	});

	describe('Callbacks', () => {
		it('onTagAdded fires when tag is added', async () => {
			const user = userEvent.setup();
			const onTagAdded = vi.fn();
			const tags = [];
			const { container } = render(TagsWrapper, {
				props: { tags, onTagAdded, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			await user.type(input, 'mytag');
			pressEnter(input);

			expect(onTagAdded).toHaveBeenCalledWith('mytag', expect.any(Array));
			expect(onTagAdded.mock.calls[0][1]).toContain('mytag');
		});

		it('onTagRemoved fires when tag is removed', async () => {
			const user = userEvent.setup();
			const onTagRemoved = vi.fn();
			const tags = ['tag1', 'tag2'];
			const { container } = render(TagsWrapper, {
				props: { tags, onTagRemoved, placeholder: '' },
			});

			const removeButtons = container.querySelectorAll('.svelte-tags-input-tag-remove');
			await user.click(removeButtons[0]);

			expect(onTagRemoved).toHaveBeenCalled();
			expect(screen.queryByText('tag1')).toBeNull();
		});

		it('onTagClick fires when tag is clicked', async () => {
			const user = userEvent.setup();
			const onTagClick = vi.fn();
			const tags = ['tag1'];
			render(TagsWrapper, {
				props: { tags, onTagClick, placeholder: '' },
			});

			const tagButton = screen.getByText('tag1');
			await user.click(tagButton);

			expect(onTagClick).toHaveBeenCalledWith('tag1');
		});
	});

	describe('customValidation', () => {
		it('rejects invalid tags per custom function', async () => {
			const user = userEvent.setup();
			const tags = [];
			const customValidation = (tag) => tag === 'valid';
			const { container } = render(TagsWrapper, {
				props: { tags, customValidation, placeholder: '' },
			});

			const input = container.querySelector('.svelte-tags-input');
			await user.type(input, 'invalid');
			pressEnter(input);

			expect(screen.queryByText('invalid')).toBeNull();

			await user.clear(input);
			await user.type(input, 'valid');
			pressEnter(input);

			expect(screen.getByText('valid')).toBeTruthy();
		});
	});

	describe('Async autoComplete requests', () => {
		const keys = {
			a: { key: 'a', keyCode: 65, which: 65 },
			ArrowDown: { key: 'ArrowDown', keyCode: 40, which: 40 },
			Enter: { key: 'Enter', keyCode: 13, which: 13 },
			Escape: { key: 'Escape', keyCode: 27, which: 27 },
		};

		async function type(input, value) {
			await fireEvent.input(input, { target: { value } });
			await fireEvent.keyUp(input, keys.a);
		}

		function deferred() {
			let resolve;
			const promise = new Promise((r) => (resolve = r));
			return { promise, resolve };
		}

		it('does not call autoComplete below minChars', async () => {
			const autoComplete = vi.fn(async () => ['Argentina']);
			const { container } = render(TagsWrapper, {
				props: { tags: [], autoComplete, minChars: 3 },
			});
			const input = container.querySelector('.svelte-tags-input');

			await type(input, 'ar');
			expect(autoComplete).not.toHaveBeenCalled();

			await type(input, 'arg');
			expect(autoComplete).toHaveBeenCalledTimes(1);
			expect(autoComplete).toHaveBeenCalledWith('arg');
		});

		it('does not refetch on arrow, Enter or Escape keyup while the list is open', async () => {
			const autoComplete = vi.fn(async () => ['Argentina', 'Armenia']);
			const { container } = render(TagsWrapper, {
				props: { tags: [], autoComplete, autoCompleteFilter: false },
			});
			const input = container.querySelector('.svelte-tags-input');

			await type(input, 'ar');
			await waitFor(() => expect(container.querySelectorAll('.svelte-tags-input-matchs li')).toHaveLength(2));

			await fireEvent.keyDown(input, keys.ArrowDown);
			await fireEvent.keyUp(input, keys.ArrowDown);
			await fireEvent.keyDown(input, keys.ArrowDown);
			await fireEvent.keyUp(input, keys.ArrowDown);
			expect(container.querySelector('.svelte-tags-input-matchs li.focus').textContent).toContain('Armenia');

			await fireEvent.keyDown(input, keys.Escape);
			await fireEvent.keyUp(input, keys.Escape);
			await fireEvent.keyUp(input, keys.Enter);

			expect(autoComplete).toHaveBeenCalledTimes(1);
		});

		it('ArrowDown still opens the list when it is closed', async () => {
			const autoComplete = vi.fn(async () => ['Argentina']);
			const { container } = render(TagsWrapper, {
				props: { tags: [], autoComplete, autoCompleteFilter: false },
			});
			const input = container.querySelector('.svelte-tags-input');

			await type(input, 'ar');
			await waitFor(() => expect(container.querySelector('.svelte-tags-input-matchs li')).toBeTruthy());
			await fireEvent.keyDown(input, keys.Escape);
			expect(container.querySelector('.svelte-tags-input-matchs')).toBeNull();

			await fireEvent.keyDown(input, keys.ArrowDown);
			await fireEvent.keyUp(input, keys.ArrowDown);
			await waitFor(() => expect(container.querySelector('.svelte-tags-input-matchs li')).toBeTruthy());
		});

		it('ignores responses from outdated searches', async () => {
			const pending = {};
			const autoComplete = vi.fn((query) => {
				pending[query] = deferred();
				return pending[query].promise;
			});
			const { container } = render(TagsWrapper, {
				props: { tags: [], autoComplete, autoCompleteFilter: false },
			});
			const input = container.querySelector('.svelte-tags-input');

			await type(input, 'ar');
			await type(input, 'arg');

			pending['arg'].resolve(['Argentina']);
			await waitFor(() => expect(container.textContent).toContain('Argentina'));

			// The slower, older response arrives last and must not replace the list
			pending['ar'].resolve(['Armenia', 'Aruba']);
			await new Promise((r) => setTimeout(r, 0));

			const items = [...container.querySelectorAll('.svelte-tags-input-matchs li')];
			expect(items.map((li) => li.textContent.trim())).toEqual(['Argentina']);
		});

		it('debounces requests with autoCompleteDebounce', async () => {
			vi.useFakeTimers();
			try {
				const autoComplete = vi.fn(async () => ['Argentina']);
				const { container } = render(TagsWrapper, {
					props: { tags: [], autoComplete, autoCompleteDebounce: 300 },
				});
				const input = container.querySelector('.svelte-tags-input');

				await type(input, 'a');
				await type(input, 'ar');
				await type(input, 'arg');
				expect(autoComplete).not.toHaveBeenCalled();

				await vi.advanceTimersByTimeAsync(300);
				expect(autoComplete).toHaveBeenCalledTimes(1);
				expect(autoComplete).toHaveBeenCalledWith('arg');
			} finally {
				vi.useRealTimers();
			}
		});

		it('calls autoComplete on every keyup when autoCompleteDebounce is 0 (default)', async () => {
			const autoComplete = vi.fn(async () => ['Argentina']);
			const { container } = render(TagsWrapper, {
				props: { tags: [], autoComplete },
			});
			const input = container.querySelector('.svelte-tags-input');

			await type(input, 'a');
			await type(input, 'ar');

			expect(autoComplete).toHaveBeenCalledTimes(2);
		});
	});
});
