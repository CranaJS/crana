function setupExtension({
  name,
  webpack: { common, dev, prod },
  babel,
  eslint,
  stylelint,
  template: { app, packageJSON },
  dependencies
}) {
  // All parameters above are paths to '.js' files exporting
  //    the respective config files
  // Those files can either directly export a config object which will then be merged
  //    or a function which will be passed all important paths
  // First step needs to be: Install all dependencies in the scope of the local Crana package
  // Then, during the creation of all config files, the above specified files are required
  //    dynamically in the scope of Crana
}

module.exports = {
  setupExtension
};
