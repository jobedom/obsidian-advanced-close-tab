import { CachedMetadata, Plugin, TFile } from "obsidian";

type FileInfo = {
	file: TFile,
	frontmatter: CachedMetadata,
	sortKey: string,
	order: number,
	active: boolean,
	index: number,
}

type FileOrderActionCallback = (activeFileInfo: FileInfo, fileList: (FileInfo | undefined)[]) => void;

export default class FileOrderButtonsPlugin extends Plugin {
	async onload(): Promise<void> {
		this.addCommand({
			id: "file-order-up",
			name: "Move file up in folder",
			callback: () => {
				this.fileOrderAction((activeFileInfo, fileList) => {
					if (activeFileInfo.index === 0) return;
					const prevFile = fileList[activeFileInfo.index - 1];
					if (prevFile === undefined) return;
					activeFileInfo.order = prevFile.order - 0.5;
				});
			},
		});

		this.addCommand({
			id: "file-order-down",
			name: "Move file down in folder",
			callback: () => {
				this.fileOrderAction((activeFileInfo, fileList) => {
					if (activeFileInfo.index === fileList.length - 1) return;
					const nextFile = fileList[activeFileInfo.index + 1];
					if (nextFile === undefined) return;
					activeFileInfo.order = nextFile.order + 0.5;
				});
			},
		});
	}

	async onunload(): Promise<void> {
		/* ... */
	}

	private async fileOrderAction(callback: FileOrderActionCallback): Promise<void> {
		const activeFile = this.app.workspace.getActiveFile();
		if (activeFile === null || activeFile.parent === null) return;
		const children = await this.app.vault.adapter.list(
			activeFile.parent.path
		);

		const fileList = children.files.map((filePath) => {
			const file = this.app.vault.getFileByPath(filePath);
			if (file === null) return;
			const frontmatter = this.app.metadataCache.getFileCache(file);
			if (frontmatter === null || frontmatter.frontmatter === undefined)
				return;
			const order = frontmatter.frontmatter.order || 99999999;
			let sortKey = "" + order;
			const active = activeFile.path === file.path;
			while (sortKey.length < 8) sortKey = "0" + sortKey;
			sortKey += `-${file.basename}`;
			const fileInfo: FileInfo = { file, frontmatter, sortKey, order, active, index: -1 };
			return fileInfo;
		});

		let sortedFileList = fileList.sort((a, b) => {
			if (a === undefined || b === undefined) return 0;
			if (a.sortKey === b.sortKey) return 0;
			return a.sortKey < b.sortKey ? -1 : 1;
		});

		sortedFileList.forEach((f, index) => {
			if (f) f.index = index;
		});

		const sortedActiveFile = sortedFileList.find((f) => f?.active);
		if (sortedActiveFile === undefined) return;

		callback(sortedActiveFile, sortedFileList);

		sortedFileList = sortedFileList.sort((a, b) => {
			if (a === undefined || b === undefined) return 0;
			if (a.order === b.order) return 0;
			return a.order < b.order ? -1 : 1;
		});

		sortedFileList.forEach((f, index) => {
			if (f === undefined) return;
			f.order = index + 1;
			this.app.fileManager.processFrontMatter(f.file, (frontmatter) => {
				frontmatter.order = f.order;
			});
		});

		setTimeout(() => {
			// @ts-ignore
			this.app.commands.executeCommandById("custom-sort:enable-custom-sorting");
		}, 100);
	}
}
