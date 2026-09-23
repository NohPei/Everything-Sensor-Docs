// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Read the Docs serves each version under /<lang>/<version>/ (e.g. /en/latest/),
// not the domain root. Pick that up from RTD's build-time env vars so asset and
// internal links resolve correctly no matter where this ends up hosted.
const base = process.env.READTHEDOCS === 'True'
	? `/${process.env.READTHEDOCS_LANGUAGE}/${process.env.READTHEDOCS_VERSION}/`
	: '/';

// https://astro.build/config
export default defineConfig({
	site: 'https://everything-sensor-docs.readthedocs.io',
	base,
	integrations: [
		starlight({
			title: 'Everything Sensor Docs',
			description:
				'Documentation for the Everything Sensor, a multimodal environmental sensing unit built for the NSF Center for Pandemic Insights.',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/NohPei/Everything-Sensor-Docs' },
			],
			editLink: {
				baseUrl: 'https://github.com/NohPei/Everything-Sensor-Docs/edit/main/',
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
