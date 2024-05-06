import { Plugin } from "obsidian";

const targetDefinitions = [
	{ regexp: /^escritura\//i, targets: ['Wiki', 'Bible'] },
	{ regexp: /^.*$/i, targets: ['Entrada', 'Wiki', 'Bible'] },
];

export default class MoveNewNotesPlugin extends Plugin {
	async onload() {
		this.app.workspace.onLayoutReady(() => {
			this.registerEvent(
				this.app.vault.on("create", async (file) => {
					// @ts-ignore
					const backLinks = this.app.metadataCache.getBacklinksForFile(file);
					const originFilePaths = Object.keys(backLinks.data);
					if (originFilePaths.length !== 1) return;
					const originFilePath = originFilePaths[0];
					targetDefinitions.forEach(({regexp, targets}) => {
						const originFolderParts = originFilePath.split('/').slice(0, -1);
						if (regexp.test(originFilePath)) {
							targets.forEach(async target => {
								let parts = [...originFolderParts];
								for (;;) {
									const candidateFolder = [...parts, target].join('/');
									const folder = this.app.vault.getFolderByPath(candidateFolder);
									if (folder !== null) {
										const newFileName = `${candidateFolder}/${file.name}`;
										await this.app.fileManager.renameFile(file, newFileName);
										return;
									}
									if (parts.length === 0) break;
									parts = parts.slice(0, -1);
								}
							});
						}
					});
				})
			);
		});
	}
}
