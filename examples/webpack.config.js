module.exports = {
  mode: "development",
  entry: ["./index.ts"],
  output: {
    filename: "bundle.js",
    path: __dirname
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "awesome-typescript-loader",
        exclude: /node_modules/
      }
    ]
  },
  devtool: "#source-map",
  externals: {
    react: "React",
    bootstrap: "bootstrap"
  }
};
