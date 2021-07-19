# Ketch.UP: super-rich components for web applications

![Ketch.UP Logo](https://raw.githubusercontent.com/smeup/ketchup/develop/docs/images/ketchup_small.png))

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Intro

Ketch.UP is a web components library, built with [Ionic’s Stencil](https://stenciljs.com/), a small TypeScript based web component compiler.

Web Components is a suite of different technologies allowing to create reusable custom elements — with their functionality encapsulated away from the rest of your code — that you can use in your web apps. For more information visit this link: https://developer.mozilla.org/en-US/docs/Web/Web_Components

The primary focus of Ketch.UP is to provide a suite of powerful and customizable web components, whose main objective is abstracting complex and recurrent programming patterns.

## Showcase

Go to [Ketch.UP Showcase](http://ketchup.smeup.com) to see our components live.

## How the repository is organized

Ketch.UP repository is a monorepo multi-package repository managed with [Lerna](https://github.com/lerna/lerna).

-   _packages/ketchup_ contains the Stencil web components library
-   _packages/ketchup_showcase_ contains the code of the components showcase (a [Vue](https://vuejs.org/) application built using Vue CLI)
-   _docs_ contains documentation

## Development

All information for developers is to be found in the [Development guide](docs/development.md).

## Are there any presentations about your work?

Yes, of course: see the [presentation list](docs/presentations.md)

<font color='red'>TODO: add presentations page</font>

## How to use this code in your project

-   Add Ketch.UP dependency to your project:

```
npm install @sme.up/ketchup --save
```

-   Define Ketch.UP custom elements in your pages:

```
import { defineCustomElements } from '@sme.up/ketchup/dist/loader';
defineCustomElements(window);
```

-   Use Ketch.UP components in your pages. About components and their props and events see [Ketch.UP Showcase](https://ketchup.smeup.com/). A simple sample for a Ketch.UP button can be:

```
<kup-button-list :buttons.prop="btnlist" @kup-button-list-click="onkup-button-list-click" />
```

## Contributing

Every kind of contribution to this project is really welcome. See our [contributing guide](CONTRIBUTING.md) for more details.

<font color='red'>TODO: add contributing page</font>

## Open issues

Here you can find a list of [open issues](docs/openIssues.md).
