<script lang="ts">
    import { fontSize } from '../controls-bar/controls-bar.store';
    import { selectText } from './helpers/focus-text';
    import LabeledAnnotations from '../../../../main';
    import {
        Annotation
    } from '../../../../editor-plugin/helpers/decorate-annotations/helpers/parse-annotations/parse-annotations';

    export let plugin: LabeledAnnotations;
    export let annotation: Annotation;
    export let isActive: boolean;
    const onClick = () => {
        selectText(annotation, plugin);
    };
</script>

<div
    class={`annotation ${annotation.label} ${isActive ? 'active' : ''}`}
    style={plugin.decorationSettings.decorations[annotation.label].annotation.attrs.style}
    on:click={onClick}
    on:keyup={onClick}
    role="button"
    tabindex="0"
>
    <div class="annotation-badge">
        <span class="line">{annotation.range.from.line + 1}</span>
        <span class="label">{annotation.label}</span>
    </div>
    <span class={'annotation-text'} style={`font-size:${$fontSize}px;`}>
        {#if annotation.isHighlight}
            <mark class={isActive ? 'active' : ''}>{annotation.text}</mark>
        {:else}
            {annotation.text}
        {/if}
    </span>
</div>

<style>
    .annotation {
        position: relative;
        cursor: pointer;
        box-sizing: border-box;
        height: fit-content;
        border: 1px solid #00000018;
        border-left-width: 10px;
        background: yellow;
        color: var(--nav-item-color);

        border-radius: var(--radius-s);
        font-size: var(--nav-item-size);
        line-height: var(--line-height-tight);
        font-weight: var(--nav-item-weight);
        margin-bottom: var(--size-2-1);
        padding: var(--size-4-2) var(--size-4-3);
    }
    .annotation:hover {
        border-color: #00000030;
    }

    mark {
        color: var(--nav-item-color);
        background-color: var(--nav-item-background-active);
        font-style: italic;
    }

    .annotation-badge {
        font-size: 10px;
        opacity: 0.3;
        margin-bottom: 2px;
    }

    .annotation-badge span.label {
        font-weight: bold;
        text-transform: uppercase;
        display: inline-block;
    }

    .annotation-badge span.line {
        opacity: 0.8;
        display: inline-block;
        margin-right: 0.5em;
    }

    .active {
        color: var(--nav-item-color-highlighted);
        background-color: var(--nav-item-background-active);
    }
</style>
