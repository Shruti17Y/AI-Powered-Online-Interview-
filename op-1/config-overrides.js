module.exports = function override(config, env) {
  // Find the source-map-loader rule
  const sourceMapRule = config.module.rules
    .find(rule => rule.use && Array.isArray(rule.use) && rule.use.some(loader => 
      loader === 'source-map-loader' || (typeof loader === 'object' && loader.loader === 'source-map-loader')
    ));

  // If found, modify it to exclude node_modules
  if (sourceMapRule) {
    sourceMapRule.exclude = /node_modules/;
  } else {
    // If not found, add a new rule
    config.module.rules.unshift({
      test: /\.js$/,
      enforce: 'pre',
      use: ['source-map-loader'],
      exclude: /node_modules/
    });
  }

  return config;
};