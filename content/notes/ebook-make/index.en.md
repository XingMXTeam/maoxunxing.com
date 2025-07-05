---
title: “E-book Creation”
date: 2021-12-01T14:53:11+08:00
tags:
  - Writing
---

This article will introduce how to use **Pandoc** to export Markdown files and create e-book covers and author information using **Sigil**. Here are the detailed steps:

## 1. Export Markdown files using Pandoc

Before creating an e-book, you first need to prepare the content files. We recommend using **Pandoc** to convert documents to Markdown format.

### Common command examples

```bash
pandoc input.docx -o output.md
```

- `input.docx`: The input document file (can be Word, HTML, etc.).
- `output.md`: The output Markdown file.

After conversion with Pandoc, you will obtain a standard Markdown file, which serves as the foundation for subsequent e-book creation.

---

## 2. Using Sigil to create the cover and author information

### 2.1 Set Sigil's language to Chinese

To make operation more convenient, you can set Sigil's interface language to Chinese:

1. Open Sigil.
2. Click on “Preferences” in the menu bar.
3. Select “Chinese” in the language options, then restart Sigil.

![Set Chinese](https://pic2.zhimg.com/80/v2-0c9dda859335efbf7437236773c661f5_1440w.webp)

---

### 2.2 Edit metadata (author, title, etc.)

1. Click “Tools” in the menu bar and select “Metadata Editor.”

![Open Metadata Editor](https://pic1.zhimg.com/80/v2-32d42d713ae5dff16ca6c61dab9c6d10_1440w.webp)

2. In the metadata editor interface, click the “Add Metadata” button on the right and fill in the following information:  
   - **Title**: The name of the e-book.  
   - **Author**: Your name or pen name.  
   - Other optional information (such as description, publication date, etc.).

   ![Metadata Editor](https://pic1.zhimg.com/80/v2-53b428d58915ba9078bb0a2c3cd3076c_1440w.webp)

   Example result:

   ![Edited metadata](https://pic3.zhimg.com/80/v2-59dd09a60aa5cbdba51a508ab45d7aae_1440w.webp)

---

### 2.3 Add a cover image

1. In the file browser on the left, select the “Image” folder.
2. Click the green “+” sign in the upper left corner to import the cover image you have prepared.

   ![Add Cover Image](https://pic3.zhimg.com/80/v2-28ce5e5101665ddadfe3371d64061a82_1440w.webp)

3. Click “Tools” in the menu bar and select “Add Cover.”
4. In the pop-up window, select the cover image you just imported.

---

### 2.4 Preview the cover effect

After completing the above steps, you can view the cover effect in the preview interface on the right.

![Cover Preview](https://pic4.zhimg.com/80/v2-7e8ccc8f040e88d0b38bf01d02e08fff_1440w.webp)

If you don't have a cover design yet, you can use the following online tools to quickly generate one:

- [O'RAY Style Cover Generator](https://orly.nanmu.me/)

---

## 3. Save and test the e-book

1. Press `Cmd + S` (Mac) or `Ctrl + S` (Windows) to save the project.
2. Drag the generated e-book file into Apple's “Books” app or another reader to test it.

---

## Summary

Following the steps above, you can easily create an e-book with a cover and author information using **Pandoc** and **Sigil**. Here's a recap of the key points:

- Use Pandoc to convert the document to Markdown format.
- Set metadata (title, author, etc.) in Sigil.
- Add a cover image and preview the effect.
- Finally, save and test the e-book.