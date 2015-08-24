# About

This documentation is rendered from Git Flavored Markdown (GFM), using [marked](https://www.npmjs.com/package/marked) and [hightlight.js](https://highlightjs.org/). The docs can be found in the `./docs` folder. To add a document, add a path to it in the `./environment/environment.json` file, in the `docs.files` object.

This engine supports language-switching. To set your supported languages, set the `docs.languages` object in the `./environment/environment.json` file. If you only support a single language, this object can be omitted from the `environment.json` file. The languge schema follows:

Property | Type | Description
-------- | ---- | -----------
name | string | The name as you would like it to appear in the Language Menu
highlightClass | string | The class name that `highlight.js` transforms the markdown to

> # Example Language

```JSON
{
    "name": "JavaScript",
    "highlightClass": "lang-js"
}
```

## Conventions

### Code Blocks

Since we're using `highlight.js` to color the code blocks, you'll want to make sure to add your language to your code block ticks:

```markdown
```js
// ...
```

### Blockquote Headings

To get the code-block-header styles in this guide, use blockquote heading combos.

#### In the future, we may support side-by-side text-code layouts. The blockquotes and code blocks will be displayed in the side-bar, so make sure you take advantage of these conventions if you're interested in using the other layout options.

```markdown
> # Code Block Header
```

It looks like this:

> # Code Block Header
```js
console.log('hello world!');
```

There's also a blockquote h2 combo, meant to be used with code blocks

```markdown
> ## Code Info
```

It looks like this:

> # Code Block H1
```js
console.log('hello world!');
```
> ## Code Block H2



## Alterations

Once the markdown is rendered, we convert the `####` (h4) and `#####` (h5) layout into notifications and warnings:

#### **Example Info**: We convert h4 elements `####` to info alerts.

##### **Example Warning**: We convert h5 elements `#####` to danger alerts.

If you would prefer that your h4 and h5 styles not be altered, set `docs.useHeadingAlerts` to `false` in your `environment.json` file.
