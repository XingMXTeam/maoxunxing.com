---
title: "Tailwind Compilation Error"
date: 2022-03-28T17:14:19+08:00
tags:
  - Tailwind
---

## **1. Error Description**

### **Error 1**

- **Error Message**:
  ```
  Error: PostCSS plugin postcss-nested requires PostCSS 8.
```

### **Error 2**

- **Error message**:
```
[Error - 4:52:42 PM] Tailwind CSS: Cannot set property 'parent' of undefined
TypeError: Cannot set property 'parent' of undefined
```

## **2. Solutions**

### **Reason Analysis**

- The above error is usually caused by incompatibility between the version of PostCSS used in the project and the version of Tailwind CSS or other plugins.

- Some older projects may need to be compatible with PostCSS 7, while the default installation of Tailwind CSS may depend on PostCSS 8.
### **Solution**

Solve the issue by installing a Tailwind CSS version compatible with PostCSS 7 and its related dependencies:

---

```shell
npm install tailwindcss@npm:@tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9
## **3. Precautions**

1. **PostCSS Version Compatibility**:

   - If your project uses PostCSS 7, ensure you install `tailwindcss@npm:@tailwindcss/postcss7-compat`.

   - If your project upgrades to PostCSS 8, you can directly install the latest version of Tailwind CSS.
2. **Dependency Version Locking**:
- After installation is complete, it is recommended to check the `package.json` file to ensure version locking is correct.

3. **Clear Cache**:
   - If the issue still persists, you can try clearing the npm cache and reinstalling dependencies:

     ```shell
npm cache clean --force
     rm -rf node_modules package-lock.json
     npm install
```
     ```
---

## **4. Reference Links**

- [Tailwind CSS Official Documentation](https://tailwindcss.com/docs/installation)

- [PostCSS GitHub Repository](https://github.com/postcss/postcss)
---

```
