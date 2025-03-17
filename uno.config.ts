import { defineConfig } from 'unocss';
import { CustomTheme } from './styles/Theme';


export default defineConfig({
	rules: [
		[/^bg-color-([a-z\d]+)$/, ([_, value]) => ({ 'background-color': `#${value}` })],
		[/^color-([a-z\d]+)$/, ([_, value]) => ({ color: `#${value}` })],
		[/^fs-(\d+px)$/, ([_, value]) => ({ 'font-size': value })],
		[/^flex-(\d+)$/, ([_, value]) => ({ 'flex': value })],
		[/^main-content-([a-z]+)$/, CustomTheme],
		['bg-custom-img', { 'background': 'var(--img) center center / cover no-repeat' }],
		[/^filter-grayscale$/, () => ({ filter: 'grayscale(100%) opacity(100%)' })],
		[/^filter-blur-(\d+%)$/, ([_, value]) => ({ filter: `blur(${value}%)` })],
		[/^opacity-([\d.]+)$/, ([_, value]) => ({ opacity: `${value}` })],
    	[/^filter-none$/, () => ({ filter: 'none' })],
		[/^text-shadow-([a-z\d]+)$/, ([_, value]) => ({ 'text-shadow': `-2px 0 #${value}, 0 2px #${value}, 2px 0 #${value}, 0 -2px #${value};` })],

	],
	shortcuts: {
		'flex-middle': 'flex items-center justify-center',
		'h-s-screen': 'h-100svh',
		'w-s-screen': 'w-100svw',
		'wh-full': 'h-full w-full',
		'wh-s-screen': 'h-s-screen w-s-screen',
		'block-center': 'flex items-center justify-center text-center',
		'text-shadow': 'text-shadow-fff',
	}
});
