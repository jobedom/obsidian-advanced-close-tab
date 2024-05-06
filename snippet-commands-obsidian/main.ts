import { Plugin } from 'obsidian';

export default class SnippetCommandsPlugin extends Plugin {

  onload() {
    this.enableCommands();
  }

  onunload() {
  }

  reloadCommands() {
    this.unload()
    this.load();
  }

  enableCommands() {
    const customCss = (this.app as any).customCss;
    const knownSnippets = customCss.snippets;
    console.log(`[Snippet Commands]: Loading commands for ${knownSnippets.length} snippets`, knownSnippets);
    knownSnippets.forEach((snippet:string) => {
      this.addCommand({
        id: `snippet-command-${snippet}`,
        name: `Toggle ${snippet}`,
        callback: () => {
          customCss.setCssEnabledStatus(snippet, !customCss.enabledSnippets.has(snippet));
        }
      });

      this.addCommand({
        id: `snippet-command-activate-${snippet}`,
        name: `Activate ${snippet}`,
        callback: () => {
          customCss.setCssEnabledStatus(snippet, true);
        }
      });

      this.addCommand({
        id: `snippet-command-deactivate-${snippet}`,
        name: `Deactivate ${snippet}`,
        callback: () => {
          customCss.setCssEnabledStatus(snippet, false);
        }
      });
    });
    this.addCommand({
      id: `snippet-command-reload-all-snippets`,
      name: `Reload snippet commands`,
      callback: () => {
        this.reloadCommands();
      }
    });
  }
}
