# Ghosting the Edge Typography

These being notes about the application of typography as it relates to Ghosting the Edge. 

## Currency ¤

The general currency symbol is used to indicate absract currency.

## Aspects

Aspects are manually title-cased and wrapped in double braces. {The Ultimate Fate Aspect Writer}

## Stunts

Stunts have 2 parts, a name and a mechanic. The name is bold title-case and set off from the desciption with an unspaced em-dash. 

### Compound Stunts

There are some stunts, especially as upgrades, which can be taken more then once for increasing effect. These are numbered and presented in a compact format when there difference is effect is only numberic.

#### Header for Gear [1, 2, 3¤]

**Compound Stunt 1|2|3**​—+2|+4|+6 for describing stunts in a compact way.

## Fate Actions Names

Attack, Defense, Overcome, and Create are encoded in text as {{Attack}}, {{Defend}}, {{Overcome Obstacle}} or {{Create Advantage}}.  

On the BookShelf instance this translates to an icon from the Fate Font. 

## Other Game Terms

It's possible to highlight other game terms using {{{Game Term}}}. On the BookShelf instance, this will translate to Small Caps.

## En Dash –

En-dashes are used to indicate a numeric range. For example​—Pages 21–34.

## Em Dash ​—

The Em-dash is commonly used in Ghosting the Edge text in place of a : to separate a word and a description. It is used without spaces, or with a thin space if needed.

## Containers

There are a number of variations of container markup that follow the pattern:

```
::: container_type container_options
content
:::
```

Container content can include most markup. 

### Sidebar

Sidebars are for small amounts of content that comment upon the main text or provide information not directly associated with main text. They are rendered as `<aside>`.

Sidebars will render narrowly and are pulled into the left or right margins depending on which container_option is specified. 

The markup is:

```
::: sidebar (left|right)
sidebar_content
:::
```

### Callouts

Callouts are similar to sidebars, but are intended to contain text that is more directly relavent to the main text. Such as a table or an example of a current mechanic. Callouts are rendered as `<article>`.

Callouts are also pulled left or right but are wider then sidebars.

The markup for a callout is:

```
::: callout (left|right)
callout_content
:::
```

### Quote

A quote is a specialized sidebar for rendering a quote or phrase that includes an attribution.

```
::: quote (left|right) attribution_text
quote_text
:::
```

The attribution_text can include non-newline whitespace, but markup will not be rendered.

### Table

Tables can be wrapped in container markup that includes a table caption. 

```
::: table table_caption
table_content
:::
```

Table container will be wrapped in a `<figure>` element.

Table_caption text with markup will be rendered.

### Columns

The columns container will wrap the given content in a `<div class=columns>`

```
::: columns
content
:::