// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://everything-sensor-docs.readthedocs.io',
	integrations: [
		starlight({
			title: 'Everything Sensor Docs',
			description:
				'Documentation for the Everything Sensor, a multimodal environmental sensing unit built for the NSF Center for Pandemic Insights.',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/NohPei/Everything-Sensor-Docs' },
			],
			editLink: {
				baseUrl: 'https://github.com/NohPei/Everything-Sensor-Docs/edit/main/src/content/docs/',
			},
			sidebar: [
				{
					label: 'Hardware',
					items: [{ label: 'Components', slug: 'hardware/components' }],
				},
				{
					label: 'Software',
					items: [
						{ label: 'Overview', slug: 'software/overview' },
						{ label: 'Board Setup', slug: 'software/board-setup' },
						{ label: 'Data Logging', slug: 'software/data-logging' },
						{ label: 'Networking', slug: 'software/networking' },
					],
				},
				{ label: 'Research Notes', slug: 'research-notes' },
				{ label: 'Versioning', slug: 'versioning' },
			],
		}),
	],
});
