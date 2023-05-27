module.exports = {
  overrides: [
    {
      files: ["*.html"],
      options: {
        parser: "go-template",
      },
    },
  ],
  plugins: [require.resolve("prettier-plugin-go-template")],
  goTemplateBracketSpacing: true,
};
