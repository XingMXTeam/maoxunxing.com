---
title: "What You Need to Know About CSS"
description: "Grid Layout; Animations: usage of animation, animation-play-state, :checked, transform; CSS writing guidelines and examples"
date: 2024-09-10
tags:
  - CSS
  - Web Development
images:
  - css/a.png
custom_toc:
  - title: "CSS Animations: Scrolling and Flipping"
  - title: "Grid Layout"
  - title: "Smoother Shadows"
  - title: "CSS Examples"
  - title: "CSS Writing Guidelines"
  - title: "CSS Resources"
  - title: "Icons"
  - title: "SVG Cutout Effect"
  - title: "Clever Use of Steps"
  - title: "Responsive Design"
---
It is recommended to use native `css + postcss` solution for CSS. Pre-compilers like less/sass increase complexity/learning cost. Use PostCSS Preset Env to support modern CSS syntax; Autoprefixer automatically adds prefixes.
VSCode Plugin: PostCSS Language Support
## CSS Animations: Scrolling and Flipping
## 1. Scrolling Animation (with Pause/Play)
### HTML Structure
The following code implements a scrolling text effect with a pause/play feature.
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CSS Animation Scroll with Pause</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <!-- Checkbox to control animation pause/play -->
    <input type="checkbox" id="toggleAnimation" />
    <label for="toggleAnimation">Pause/Play</label>
    <!-- Scrolling container -->
    <div class="scroll-container">
      <div class="scroll-content">This is a scrolling text!</div>
    </div>
  </body>
</html>
```
### CSS Styles
```css
/* Scroll container styles */
.scroll-container {
  width: 100%;
  height: 50px;
  overflow: hidden; /* Hide overflow */
  background-color: lightgray;
  position: relative;
}
/* Scroll content styles */
.scroll-content {
  white-space: nowrap; /* Prevent line breaks */
  position: absolute;
  animation: scroll-animation 10s linear infinite; /* Define scrolling animation */
  animation-play-state: running; /* Animation is running by default */
}
/* Scrolling animation */
@keyframes scroll-animation {
  0% {
    transform: translateX(100%); /* Start from the right */
  }
  100% {
    transform: translateX(-100%); /* Exit to the left */
  }
}
/* Use :checked selector to control animation pause/play */
input[type="checkbox"]:checked ~ .scroll-container .scroll-content {
  animation-play-state: paused; /* Pause the animation */
}
```
## 2. Flipping Animation
The following code implements a simple flipping animation, suitable for scenarios requiring repetitive movement.
```css
@keyframes roll {
  0% {
    transform: translateX(-0px); /* Initial position */
  }
  100% {
    /* A 200px wide container, flipping 100 times */
    transform: translateX(calc(100 * -200px)); /* Final position */
  }
}
```
### Additional Notes
1.  **Scrolling Animation**:
    -   The `animation-play-state` property is used to control the running state of the animation (`running` or `paused`).
    -   The pause and play toggle is achieved using the `:checked` pseudo-class of the checkbox.
2.  **Flipping Animation**:
    -   Uses the `calc()` function to dynamically calculate the displacement distance.
    -   The container width and number of flips can be adjusted based on actual needs.
3.  **Use Cases**:
    -   Scrolling animations are suitable for notice boards, marquees, etc.
    -   Flipping animations are suitable for elements that need to move in a loop, such as carousels or background animations.
---
## Grid Layout
A simple business card layout, including a product title, description, price, and buy button.
```html
<div class="card-content">
  <h2>Product Title</h2>
  <p>
    Description of the product goes here. It highlights the key features
    and benefits.
  </p>
  <span class="price">$49.99</span>
  <button class="buy-button">Buy Now</button>
</div>
```
Use **CSS Grid** to define the structure and style of the card.
```css
.business-card {
  display: grid;
  grid-template-columns: 200px 1fr; /* Define two columns: the first with a fixed width of 200px, the second taking up the remaining space */
  grid-template-rows: 50px 200px 1fr; /* Define three rows: the first with a height of 50px, the second with 200px, and the third taking up the remaining space */
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(185, 156, 156, 0.1); /* Add shadow effect */
  max-width: 800px; /* Max width for the card */
  width: 100%; /* Card width is responsive */
}
.card-image {
  grid-row-start: 1; /* Image starts on the first row */
  grid-row-end: 2;   /* Image ends on the second row */
}
```
1.  **Meaning of `1fr`**:
    -   `1fr` means that in a grid layout, each column or row has an equal size, and the size is allocated relative to the total size of the container.
    -   For example, `grid-template-columns: 200px 1fr` means the first column has a fixed width of 200px, and the second column takes up all the remaining space.
2.  **`grid-template-columns`**:
    -   Defines the number of columns and the width of each column in the grid layout.
    -   Example:
        ```css
        grid-template-columns: 200px 1fr;
        ```
        The code above means:
        -   The first column has a width of 200px.
        -   The second column takes up the remaining space.
3.  **`grid-template-rows`**:
    -   Defines the number of rows and the height of each row in the grid layout.
    -   Example:
        ```css
        grid-template-rows: 50px 200px 1fr;
        ```
        The code above means:
        -   The first row has a height of 50px.
        -   The second row has a height of 200px.
        -   The third row takes up the remaining space.
4.  **`grid-row-start` and `grid-row-end`**:
    -   Used to specify the starting and ending row of an element in the grid layout.
    -   Example:
        ```css
        grid-row-start: 1;
        grid-row-end: 2;
        ```
        The code above means the element starts from the first row and ends at the second row.
### Use Cases
-   **Business Cards**: Suitable for product displays on e-commerce sites, blog post cards, etc.
-   **Responsive Design**: Using `grid-template-columns` and `grid-template-rows` makes it easy to implement responsive layouts that adapt to different screen sizes.
-   **Separation of Image and Content**: `grid-row-start` and `grid-row-end` allow for flexible control over the layout position of images and other content.
---
## Smoother Shadows
{{< img src="effect.png" alt="Business card shadow effect" maxWidth="140px" caption="Business card shadow effect" >}}
Two business card layouts, each with a different shadow effect applied.
```html
<!DOCTYPE html>
<html style="height: 100%">
  <head>
    <meta charset="utf-8" />
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body style="height: 100%; margin: 0">
    <!-- Card 1: Basic Shadow -->
    <div class="business-card1"></div>
    <!-- Card 2: Layered Shadow -->
    <div class="business-card2"></div>
  </body>
</html>
```
Two different shadow effects, applied to two business cards respectively.
```css
/* Page background color */
body {
  background-color: #f1cffb;
}
/* Card 1: Basic Shadow */
.business-card1 {
  background-color: white;
  width: 100px;
  height: 100px;
  margin: 20px;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);
  /* Normal usage: x-offset y-offset blur color */
}
/* Card 2: Layered Shadow */
.business-card2 {
  background-color: white;
  width: 100px;
  height: 100px;
  margin: 20px;
  box-shadow: 
    0 1px 1px rgba(0, 0, 0, 0.03), 
    0 2px 2px rgba(0, 0, 0, 0.03),
    0 4px 4px rgba(0, 0, 0, 0.03), 
    0 8px 8px rgba(0, 0, 0, 0.03),
    0 16px 16px rgba(0, 0, 0, 0.03), 
    0 64px 64px rgba(0, 0, 0, 0.03);
  /* By using a geometric progression to adjust y-offset and blur, the projection is layered to achieve a smoother and more realistic shadow effect */
}
/* Elements closer to the view have smaller blur and x/y-offset values; farther elements have larger values */
```
1.  **`box-shadow` Property**:
    -   `box-shadow` is used to add shadow effects to an element.
    -   Basic syntax:
        ```css
        box-shadow: x-offset y-offset blur spread color;
        ```
        -   `x-offset`: Horizontal offset of the shadow (positive value to the right, negative to the left).
        -   `y-offset`: Vertical offset of the shadow (positive value downwards, negative upwards).
        -   `blur`: Blur radius (the larger the value, the more blurred the shadow).
        -   `spread`: Spread radius of the shadow (positive value expands the shadow, negative shrinks it).
        -   `color`: Shadow color.
2.  **Basic Shadow vs Layered Shadow**:
    -   **Basic Shadow**: Defined with a single `box-shadow`, suitable for simple shadow effects.
        ```css
        box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);
        ```
    -   **Layered Shadow**: Defined with multiple `box-shadow` values, achieving a smoother, more realistic shadow effect by adjusting `y-offset` and `blur` in a geometric progression.
        ```css
        box-shadow: 
          0 1px 1px rgba(0, 0, 0, 0.03), 
          0 2px 2px rgba(0, 0, 0, 0.03),
          0 4px 4px rgba(0, 0, 0, 0.03), 
          0 8px 8px rgba(0, 0, 0, 0.03),
          0 16px 16px rgba(0, 0, 0, 0.03), 
          0 64px 64px rgba(0, 0, 0, 0.03);
        ```
3.  **Sense of Shadow Depth**:
    -   Elements closer to the view: smaller `blur` and `x/y-offset` values.
    -   Elements farther from the view: larger `blur` and `x/y-offset` values.
### Use Cases
-   **Basic Shadow**: Suitable for simple card or button designs, providing a basic sense of depth.
-   **Layered Shadow**: Suitable for designs requiring higher visual quality, such as high-end product displays, UI components, etc.
-   **Responsive Design**: Shadow effects can be dynamically adjusted according to screen size to enhance user experience.
---
## CSS Examples
## CSS Positioning and Layout
### Special Behavior of `position: fixed`
When a parent element uses the `transform` property, an element with `position: fixed` will be positioned relative to the parent element, not the viewport.
```css
.parent {
  transform: translate(0, 0);
}
.child {
  position: fixed;
  top: 0;
}
```
### Flex Layout and Equal Width Issues
In a Flex layout, if child elements cannot have equal widths due to content overflow, it can be solved as follows:
```css
.child {
  flex-grow: 1;
  flex-basis: 0; /* Or set a percentage */
}
.parent {
  flex-wrap: wrap; /* Automatically wrap when there are too many child elements */
}
```
**Example**: Maintaining equal width in an adaptive card layout.
### Slider Layout Tricks
To ensure the sliding list aligns with the edges, avoiding `margin` from affecting calculations:
```css
.slider-list {
  margin: 0 -8px;
}
.slick-slider {
  margin: 0; /* Do not set extra margin */
}
```
**Example**: How to make a slider's sides touch the edges (e.g., width 1616, 16px spacing between cards).
## Responsive Design
### Square Adaptive Images
Achieve a square container using `padding-bottom` and absolute positioning:
```css
.container {
  position: relative;
  width: 100%;
  padding-bottom: 100%; /* Square */
}
.image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  object-fit: cover;
  width: 100%;
  height: 100%;
}
```
**Example**: How to ensure a card image remains a square when its width is adaptive.
### Text Wrapping and No-Wrapping
Use `white-space: nowrap` to prevent text from wrapping:
```css
.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```
**Example**: Text wrapping issue in a responsive Flex layout card on small screens.
## Image and Background Optimization
### Image Compression and Adaptation
When compressing images with a CDN, prioritize display effect over design draft dimensions. For example, the default size for a business card image is 480x480.
### Background Image Setting Tricks
- **Fit background image to module height**:
  ```css
  .module {
    background-color: rgb(255, 248, 220);
    background-image: url('image.jpg');
    background-size: auto 100%;
    background-position: center top;
    background-repeat: no-repeat;
  }
  ```
- **Responsive background image**:
  ```css
  .responsive-bg {
    background-size: 100% auto; /* Avoid stretching or compressing */
  }
  ```
## Flexbox and Grid
### Handling Equal-Width Child Elements
Achieve equal-width layout using `flex-grow` and `flex-basis`:
```css
.child {
  flex-grow: 1;
  flex-basis: 0;
}
.parent {
  display: flex;
  flex-wrap: wrap;
}
```
### Adjusting Spacing in Sliding Containers
Avoid `slider` calculation errors:
```css
.slider-list {
  margin: 0 -8px; /* Set negative margin on the outer container */
}
```
## Text and Overflow
### Text Ellipsis
Achieve text ellipsis without setting a width:
```css
.text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```
### Font Alignment and Line Height
- **Prevent font from being cut off**:
  ```css
  .text {
    line-height: 1.2;
  }
  ```
- **Top-align image and text**:
  ```css
  .container {
    display: flex;
    align-items: flex-start;
  }
  ```
## CSS Selectors
### Advanced Usage of `nth-child`
Use `nth-child(n of selector)` to select child elements of a specific class:
```css
article:nth-child(2 of .bar) {
  color: red;
}
```
**Example**: Highlight the second `.bar` element.
## Other Tricks
### Chrome Compatibility Issues
`unset` is not compatible with older versions of Chrome, which may cause style anomalies:
```css
.card {
  height: unset; /* Alternative: height: auto; */
}
```
**Example**: Abnormal hover style on cards in older versions of Chrome.
### React-Slick Usage Guide
React-Slick is a powerful carousel component library that supports vertical scrolling and complex layouts:
```javascript
import Slider from 'react-slick';
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  vertical: true, // Vertical scrolling
};
<Slider {...settings}>
  <div>Slide 1</div>
  <div>Slide 2</div>
</Slider>;
```
**Example**: How to implement a vertically scrolling carousel component.
## CSS Compression
https://forgemia.inra.fr/lisc/geopat/-/tree/master/web_application/node_modules/csso
csso webpack plugin Selector can't has classes from different scopes
Some classNames are not assigned to scopes.
## import css
`import styles from "./index.module.css"` needs to be after `js import`. If it's in the middle, it might cause the class name priority of the CSS build artifact to be different.
---
## CSS Writing Guidelines
> [Original Article Here](https://w3cplus.medium.com/%E9%98%B2%E5%BE%A1%E5%BC%8F-css-%E7%B2%精%E8%AE%B2-2d45a58dcbf1)  
This is an excellent article covering the core principles and practical techniques of Defensive CSS. The following is a collated web backup with some additional notes and personal experience.
## I. Layout
### 1. Layout Principles
- **Avoid using `wrapper` DOM structures**: Reduce unnecessary nesting.
- **Avoid table-like thinking**: Do not introduce extra row/column elements.
- **Do not use JavaScript to control layout**: All layout and alignment should be implemented with **Flexbox/Grids**, avoiding the use of the following properties:
  - `absolute`
  - `display: table`
  - `float`
  - `height/line-height`
  - `display: inline-block` and `vertical-align: middle` (unreliable)
## II. Scrollbar Issues
### 1. Scroll Behavior Control
```css
/* Supported in Chrome 63+ / Firefox 59+, not supported in Safari and Edge */
overflow-behavior: contain;
```
### 2. Avoid Simultaneous Horizontal and Vertical Scrolling
```css
overflow-x: auto;
overflow-y: hidden;
```
## III. Wrapping and Overflow
### 1. Wrapping Handling
```css
overflow-wrap: break-word; /* Automatic line break */
hyphens: auto; /* Automatic hyphenation */
/* Limit number of lines */
-webkit-line-clamp: 3;
```
### 2. Scenarios for No Wrapping
Applicable to titles, column headers, buttons, etc., that need to be displayed on a single line:
```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
/* May overflow in a Flexbox container? Solution: */
min-width: 0; /* Use with flex: 1 */
```
### 3. Comparison with `width: max-content`
```css
width: max-content; /* May cause the container width to exceed expectations */
```
## IV. Preventing Content from Being Incompletely Displayed/Truncated
### 1. Icon and Image Adaptation
- **Icons support scaling**: Ensure icons are clear at different resolutions.
- **Limit image dimensions**:
  ```css
  max-width: 100%;
  max-height: 100%;
  min(100px, 100%);
  ```
### 2. Avoid Defining `overflow: hidden` on Containers
```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
/* Handle inline elements */
display: block;
```
## V. Avoiding Fixed Width/Height
### 1. Use `min-width` and `min-height`
Fixed width/height can cause content to overflow. It is recommended to use `min-width` and `min-height` instead:
```css
min-width: 200px;
min-height: 100px;
```
### 2. Alignment
Use **Flexbox** for alignment, avoiding traditional layout methods.
## VI. Avoiding Intrusive Styles
### 1. Style Modularization
- **Variable modularization**: Manage global styles through CSS variables.
- **z-index specification**:
  - Small range: `1-9`
  - Medium range: `10-99`
- **Avoid using inline styles and `!important`**.
## VII. Avoiding Accidental or Missed CSS Code Changes
### 1. Selector Splitting
Split complex selectors into multiple simple selectors for easier maintenance.
### 2. Writing Styles in Modules
- Divide style files by functional modules.
- Place `@media` queries with module styles.
### 3. Specificity for Fine-Tuning Styles
When fine-tuning styles, be as specific as possible to avoid affecting other modules.
## VIII. Preventing Content from Being Obscured
### 1. Negative Margin Issues
Negative margins can cause content to be obscured and should be used with caution:
```css
position: relative;
margin: -10px;
```
## IX. Preventing Content from Being Overly Crowded
### 1. Set `margin`
Ensure each element has appropriate spacing to avoid content being too crowded:
```css
margin: 10px;
```
## X. Click Area Too Small
### 1. Expanding Click Area with Pseudo-elements
Increase the click area using pseudo-elements:
```css
button {
  position: relative;
}
button::before {
  content: '';
  position: absolute;
  top: -10px;
  right: -10px;
  bottom: -10px;
  left: -10px;
}
```
## XI. Preventing Image Distortion
### 1. Image Adaptation
```css
object-fit: cover; /* Maintain image aspect ratio and crop excess parts */
```
### 2. Flexbox Default Stretching Issue
In a Flexbox layout, images may be automatically stretched. This can be fixed with the following setting:
```css
align-items: center; /* or stretch */
```
## XII. Preventing Image Load Failure
### 1. Placeholder Styles
Provide placeholder styles for when an image fails to load:
```css
background: #eee;
box-shadow: inset 0 0 0 1px #aaa;
```
## XIII. Preventing CSS Variables from Not Being Imported
### 1. Provide Default Values
Ensure CSS variables have a default value when they are not defined:
```css
font-size: var(--default-size, 12px);
```
## XIV. Flexbox Default Behavior
### 1. Common Settings
```css
flex-wrap: wrap; /* Automatic wrapping */
justify-content: space-between; /* Child elements are evenly distributed */
align-items: center; /* Vertically centered */
gap: 4px; /* Spacing between child elements */
```
### 2. Notes
- **When a child node has no width, the default is `max-content`**.
- **`flex-basis: 0` ignores the actual width**.
- **Default is no wrapping**.
- **Child nodes have equal height by default**: `align-items: stretch`.
- **Child nodes do not collapse `margin`**.
### 3. Space Distribution
- `space-evenly`: The width between child elements is always consistent.
- `space-around`: Only the spacing between the middle child elements is consistent.
## XV. Grid Layout
### 1. Common Settings
```css
grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
grid-gap: 8px;
```
### 2. Notes
- **Does not wrap automatically**: Requires `@media` queries to achieve responsive layout.
- **Compatibility**: No issues in PC scenarios, mobile compatibility needs to be confirmed.
## XVI. Browser Minimum Font Size Limit
Different browsers have different support for minimum font sizes:
- **UC Browser**: `8px`
- **Chrome (PC)**: `12px`
- **Safari/Firefox/Chrome (Mobile)**: `1px`
---
## CSS Resources
https://www.w3.org/People/xiaoqian/talks/bytedance-2021/Overview.html
https://2024.stateofcss.com/en-US/
https://www.w3.org/Style/CSS/read
https://www.w3.org/TR/css-2020/
https://www.w3.org/Style/CSS/
https://linxz.github.io/blog/defensive-css
---
## Icons
## Providing Excellent Icons
When a user visits your webpage, the browser will try to extract an icon from the HTML. The icon can appear in many places, including the browser tab, the recent apps switcher, new (or recently visited) tab pages, etc.
For example, adding to the Home screen (its Home screen icon (or the Web Clip icon), and its startup image)
```
<!-- icon in the highest resolution we need it for -->
<link rel="icon" sizes="192x192" href="icon.png">
<!-- reuse same icon for Safari -->
<link rel="apple-touch-icon" href="ios-icon.png">
<!-- multiple icons for IE -->
<meta name="msapplication-square310x310logo" content="icon_largetile.png">
```
twitter:
<link rel="icon" sizes="192x192" href="https://abs.twimg.com/responsive-web/web/ltr/icon-default.882fa4ccf6539401.png">
alipress:
<link rel="shortcut icon" href="/img/logo/favicon.ico">
taobao:
<link href="//gw.alicdn.com/tps/i2/TB1nmqyFFXXXXcQbFXXE5jB3XXX-114-114.png" rel="apple-touch-icon-precomposed"> This would add a gloss effect in iOS 7, but it's no longer added.
<link href="//gw.alicdn.com/tps/i2/TB1nmqyFFXXXXcQbFXXE5jB3XXX-114-114.png" rel="Shortcut Icon" type="image/x-icon">
Favicons.ico is not recommended.
192
114
## Defining Browser Element Colors
### Meta Theme Background Color for Chrome and Opera
```
<!-- Chrome, Firefox OS and Opera -->
<meta name="theme-color" content="#4285f4">
```
Address bar color:
![](index_files/7f233d96-08f1-4665-a852-2594d2d0a2e7.jpg)
## Setting a Startup Image
### Safari
```
<link rel="apple-touch-startup-image" href="icon.png">
```
---
## SVG Cutout Effect
### Overview
SVG (Scalable Vector Graphics) supports creating complex visual designs through cutout effects. By adjusting the `fill` and `stroke` properties of paths or shapes, a background cutout effect can be achieved while preserving other parts of the graphic.
**Features:**
- Background cutout can be implemented using `mask` or `clip-path`.
- The color of the graphic can be dynamically adjusted to adapt to different background colors.
### Example
| **Knowledge Point** | **Example Description** |
|---|---|
| SVG supports cutouts | For example: The background color of an arrow can be configured to be transparent (cutout), but the arrow's color will dynamically adjust based on the background to maintain visual consistency. |
**Use Cases:**
- Icon designs that need to blend with the background.
- When switching themes dynamically, the color of icons or graphics needs to change with the background.
---
## Clever Use of Steps
`steps()` is a powerful feature in CSS3 used to create frame animation effects. It simulates frame-by-frame animation by dividing the animation into multiple discrete steps.
## Syntax
The syntax for `steps()` is as follows:
```css
animation-timing-function: steps(<number_of_steps>, <direction>);
```
### Parameter Description
1.  **`<number_of_steps>`**
    -   Represents the number of steps (i.e., frames) the animation is divided into.
    -   For example: `steps(4)` means the animation is divided into 4 steps.
2.  **`<direction>`**
    -   An optional parameter that indicates how each step is executed. There are two main values:
        -   `start`: The animation jumps to the next step immediately at the beginning of each step.
        -   `end` (default value): The animation jumps to the next step at the end of each step.
## Use Cases
### 1. Frame Animation Effect
The most common use of `steps()` is to create frame-by-frame animations. For example, you can easily create a frame animation using a sprite sheet.
#### Example Code
HTML:
```html
<div class="frame-animation"></div>
```
CSS:
```css
.frame-animation {
  width: 100px;
  height: 100px;
  background: url('sprite.png') 0 0 no-repeat;
  animation: play 1s steps(4) infinite;
}
@keyframes play {
  from {
    background-position: 0 0;
  }
  to {
    background-position: -400px 0; /* Assuming the sprite sheet has 4 frames, each 100px wide */
  }
}
```
#### Effect
-   The animation will complete 4 frames of change within 1 second, with each frame lasting 0.25 seconds.
-   Each frame of the sprite sheet will be displayed in sequence, creating a continuous animation effect.
### 2. Typewriter Effect
`steps()` can also be used to create a typewriter effect, displaying text character by character.
#### Example Code
HTML:
```html
<div class="typewriter">Hello, World!</div>
```
CSS:
```css
.typewriter {
  width: 0;
  white-space: nowrap;
  overflow: hidden;
  border-right: 2px solid black;
  animation: typing 4s steps(14, end), blink-caret 0.75s step-end infinite;
}
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 14ch; /* Assuming the text length is 14 characters */
  }
}
@keyframes blink-caret {
  from, to {
    border-color: transparent;
  }
  50% {
    border-color: black;
  }
}
```
#### Effect
-   The text will be displayed character by character, as if a typewriter is typing.
-   The cursor will blink at a fixed frequency, enhancing the visual effect.
## Notes
1.  **Difference from `linear` and `ease`**
    -   `linear` and `ease` are smooth transition animation effects, while `steps()` is a discrete, frame-by-frame animation effect.
    -   `steps()` is more suitable for simulating frame animations or scenarios that require precise control over timing.
2.  **Performance Optimization**
    -   When using `steps()`, minimize DOM operations and complex calculations to ensure smooth animation.
3.  **Compatibility**
    -   `steps()` is widely supported in modern browsers, but may require fallback handling in older browsers.
---
## Responsive Design
### Fully Responsive Design Principles
The core of fully responsive design is:
- **No reliance on media queries**: Dynamically calculate screen width and apply corresponding styles using `useResponsive`.
- **Modular design**: Divide the page into independent modules, with each module adapting to the screen width.
- **High-contrast debugging**: Visually verify the design by simulating a 750px width (a common mobile resolution) to ensure consistency.
### Segmented Responsive Design Specifications
To meet the display needs of different devices, we divide the screen width into the following ranges and define corresponding rules for the number of cards and spacing:
| Screen Width Range | Card Count | Spacing |
|---|---|---|
| `>= 1920px` | 6 | 16px |
| `1680px <= width < 1920px` | 6 | 16px |
| `< 1680px` | 5 | 16px |
For more granular adjustments, segmented responsive design can be achieved through media queries.
### Card Count and Spacing Rules
Based on the specifications above, here is the specific implementation logic:
1.  **Large Screen Devices (>=1920px or 1680px <= width < 1920px)**
    -   Display 6 cards, with a 16px gap between each card.
    -   Ensure the overall layout is aligned to avoid extra white space.
2.  **Small to Medium Screen Devices (<1680px)**
    -   Display 5 cards, also with a 16px gap between each card.
    -   Adjust card width to fit the screen size, ensuring content readability and aesthetics.
### `useResponsive` Implementation
With the `useResponsive` utility, we can dynamically get the current screen width and render different layouts based on predefined rules. Here is a pseudo-code example:
```javascript
import { useResponsive } from 'responsive-utils';
function HomePage() {
  const { width } = useResponsive();
  // Dynamically calculate card count based on screen width
  const cardCount = width >= 1680 ? 6 : 5;
  const gap = 16; // Card spacing is fixed at 16px
  return (
    <div className="card-container" style={{ gap: `${gap}px` }}>
      {Array.from({ length: cardCount }).map((_, index) => (
        <Card key={index} />
      ))}
    </div>
  );
}
```
### Segmented Responsive Design with Media Queries
In addition to dynamic calculation with `useResponsive`, we can also implement segmented responsive design using CSS media queries. Here is an implementation based on media queries:
```css
/* Default styles */
.card-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* Display 5 cards by default */
  gap: 16px; /* Card spacing */
}
/* Large screen device styles */
@media (min-width: 1680px) {
  .card-container {
    grid-template-columns: repeat(6, 1fr); /* Display 6 cards */
  }
}
/* Extra-large screen device styles */
@media (min-width: 1920px) {
  .card-container {
    grid-template-columns: repeat(6, 1fr); /* Continue to display 6 cards */
  }
}
```
#### Explanation:
1.  **Default styles**: Apply to small and medium devices (<1680px), displaying 5 cards.
2.  **Large screen device styles**: When the screen width reaches 1680px, switch to a 6-card layout.
3.  **Extra-large screen device styles**: When the screen width reaches 1920px, maintain the 6-card layout.
This approach ensures that the layout automatically adjusts at different screen widths, while also being compatible with environments that do not support JavaScript.
## Development and Debugging Suggestions
1.  **Use Chrome Developer Tools**
    -   Enable responsive mode in Chrome Developer Tools and set the screen width to 750px (or another target resolution).
    -   Compare the design draft with the actual result to ensure consistency in layout, spacing, and content.
2.  **High-Contrast Verification**
    -   When the browser screen width is set to 750px, check if the number of cards meets expectations (e.g., 5 cards should be displayed at this point).
    -   Ensure that the ratio of spacing and card width is consistent with the design draft.
