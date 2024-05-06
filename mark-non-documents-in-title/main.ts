import { Plugin } from "obsidian";

export default class MarkNonDocumentsInTitlePlugin extends Plugin {
	async onload() {
		this.app.workspace.onLayoutReady(() => {
			this.registerInterval(
				window.setInterval(() => {
					if (document.title.endsWith(' ¶')) document.title = document.title.slice(0, -2);
					const isSuggestionContainerVisible = document.getElementsByClassName('suggestion-container').length > 0;
					const isMarkdownEditor = this.app.workspace.activeEditor?.editor?.hasFocus() && !isSuggestionContainerVisible;
					document.title += isMarkdownEditor ? '' : ' ¶';
				}, 250)
			);
		});
	}
}
