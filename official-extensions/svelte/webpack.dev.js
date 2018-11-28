module.exports = function create(PATHS) {
  return {
    module: {
		rules: [
			{
				test: /\.html$/,
				include: [PATHS.client.app],
				use: {
					loader: 'svelte-loader',
					options: {
						skipIntroByDefault: true,
						nestedTransitions: true,
						hotReload: true
					}
				}
            },
        ]
    }
  };
}