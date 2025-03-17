export const CustomTheme =  ([, value]: RegExpMatchArray, ) => {
	return {
		'background-color': '#ffffff',
		// 'height': '500px',
	};
	if (value == "dark") {
		return {
			'background-color': '#d3d3d380',
			// 'height': '500px',
		};
	} else {
		return {
			'background-color': '#d3d3d380',
			// 'height': '500px',
		};
	}
}