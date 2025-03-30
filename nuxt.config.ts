import removeConsole from 'vite-plugin-remove-console';
import { defineNuxtConfig } from 'nuxt/config';
import { copySync, existsSync } from 'fs-extra';
import { resolve } from 'path';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	app: {
		head: {
			link: [
				{ rel: 'icon', href: '/favorite.ico' },
				{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Figtree&display=swap' },
				{ rel: 'stylesheet', href: '"https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100..900&family=Zen+Maru+Gothic&display=swap"' }
			],
			script: [
				{
				  src: 'https://www.instagram.com/embed.js',
				  async: true,
				},
			],
			title: ''
		},
		keepalive: true,
		baseURL: process.env.BASE_URL || '/',
	},

	devServer: {
		host: "0.0.0.0",
		port: Number(process.env.DEV_SERVER_PORT) || 3000,
		cors: {
		  origin: "*", // 允許所有來源
		  credentials: true
		}
	},

	devtools: { enabled: false },

	experimental: {
		headNext: true,
		// inlineSSRStyles: false
	},

	imports: {
		dirs: ['./composables/**/*.ts']
	},

	modules: [
		'@unocss/nuxt',
		'@vueuse/nuxt',
		'nuxt-purgecss',
		'@element-plus/nuxt'
	],

	nitro: {
		compressPublicAssets: true,
	},

	purgecss: {
		enabled: false,
		safelist: {
			deep: [],
			standard: [
				/-(appear|enter|leave)(|-(active|from|to))$/,
				/--unocss--/,
				/-\[\S+\]/,
				/.*data-v-.*/,
				/:deep/,
				/:global/,
				/:slotted/,
				/^(?!cursor-move).+-move$/,
				/^nuxt-link(|-exact)-active$/,
				/__uno_hash_(\w{6})/,
				'__nuxt',
				'body',
				'html',
				'nuxt-progress'
			]
		}
	},

	ssr: false,

	typescript: {
		tsConfig: {
			compilerOptions: {
				noImplicitOverride: true,
				noUncheckedIndexedAccess: true,
				noUnusedLocals: true,
				noUnusedParameters: true,
				"types": ["element-plus/global"]
			}
		},
		typeCheck: true
	},

	vite: {
		plugins: [removeConsole()]
	},

	elementPlus: {
		themes: ['dark'],
	},

	css: [
		'~/styles/global.css',
	],

	compatibilityDate: '2024-07-17',
	hooks: {
		'nitro:build:public-assets': () => {
		  const src = resolve(process.cwd(), 'data'); // 原始資料夾路徑
		  const dest = resolve(process.cwd(), 'Dokidoki-Website/data'); // 複製目標位置

		  if (existsSync(src)) {
			try {
			  copySync(src, dest, { overwrite: true });
			  console.log(`✔ Successfully copied 'data' to ${dest}`);
			} catch (err) {
			  console.error(`❌ Failed to copy 'data':`, err);
			}
		  } else {
			console.warn(`⚠ 'data' folder does not exist at ${src}, skipping copy.`);
		  }
		},
	  },
});