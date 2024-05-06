import { annotationsToText } from './annotations-to-text';
import { beforeAll, describe, expect, it, vi } from 'vitest';

const samples: {
    name: string;
    input: Parameters<typeof annotationsToText>;
    output: string;
}[] = [
    {
        name: 'basic',
        input: [
            [
                {
                    folder: 'folder a',
                    basename: 'note 1',
                    path: 'folder a/note 1.md',
                    annotations: [
                        {
                            text: 'some highlight',
                            isHighlight: true,
                            label: 'n',
                        },
                    ],
                },
            ],
            {
                front: ``,
                header: `# {{note_name}}`,
                highlight: `- {{highlight_text}}`,
                comment: `- _{{comment_text}}_`,
            },
            'samples',
        ],
        output: [`# note 1`, '- some highlight'].join('\n'),
    },
    {
        name: '2',
        input: [
            [
                {
                    annotations: [
                        {
                            text: 'The third-order intercept point relates nonlinear products caused by the third-order nonlinear term',
                            label: '',
                            isHighlight: true,
                        },
                        {
                            text: 'has the advantage that it is not restricted to broadband',
                            label: 'n',
                            isHighlight: false,
                        },
                        {
                            text: 'It can be read off from the input or output power axis, leading to input',
                            label: 'i',
                            isHighlight: true,
                        },
                    ],
                    basename: 'Third-order intercept point',
                    folder: 'clipboard/other',
                    path: 'clipboard/other/Third-order intercept point.md',
                },
                {
                    annotations: [
                        {
                            text: '',
                            label: 'n',
                            isHighlight: false,
                        },
                        {
                            text: '3rd order intermodulation products (D3 and D4) are the result of nonlinear behavior of an amplifier',
                            label: '',
                            isHighlight: true,
                        },
                    ],
                    basename: 'Intermodulation',
                    folder: 'clipboard',
                    path: 'clipboard/Intermodulation.md',
                },
                {
                    annotations: [
                        {
                            text: '',
                            label: '',
                            isHighlight: false,
                        },
                    ],
                    basename: 'Second-order intercept point',
                    folder: 'clipboard',
                    path: 'clipboard/Second-order intercept point.md',
                },
            ],
            {
                front: `{{time_tag}}\n({{root_folder}})`,
                header: `# {{note_name}}`,
                highlight: `- {{highlight_text}}`,
                comment: `- _{{comment_text}}_`,
            },
            'samples',
        ],
        output: `#24/01/14/21/20
(samples)

# Third-order intercept point
- The third-order intercept point relates nonlinear products caused by the third-order nonlinear term
- _has the advantage that it is not restricted to broadband_
- It can be read off from the input or output power axis, leading to input

# Intermodulation
- 3rd order intermodulation products (D3 and D4) are the result of nonlinear behavior of an amplifier`,
    },
    {
        name: 'empty template',
        input: [
            [
                {
                    folder: 'folder a',
                    basename: 'note 1',
                    path: 'folder a/note 1.md',
                    annotations: [
                        {
                            text: 'some comment',
                            isHighlight: false,
                            label: 'n',
                        },
                        {
                            text: 'some highlight',
                            isHighlight: true,
                            label: 'n',
                        },
                    ],
                },
            ],
            {
                front: ``,
                header: `# {{note_name}}`,
                highlight: `- {{highlight_text}}`,
                comment: ``,
            },
            'samples',
        ],
        output: [`# note 1`, '- some highlight'].join('\n'),
    },
];

beforeAll(() => {
    vi.setSystemTime(new Date('2024-01-14T21:20:23.504Z'));
});

describe('annotationsToText', () => {
    for (const sample of samples) {
        it(sample.name, () => {
            const output = annotationsToText(...sample.input);

            expect(output).toBe(sample.output);
        });
    }
});
