module.exports = {
  "prettier.proseWrap": "always",
  "prettier.printWidth": 80,
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
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
