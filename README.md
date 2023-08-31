<h2 align="center">klara-js</h3>
<p align="center">
    Retrieve and manage your ePost/klara snail mail with ease.
</p>

<br/>

<div align="center">

[![Build, Lint and Test](https://github.com/cytex-media-solutions/klara-js/actions/workflows/build-and-test.yml/badge.svg)](https://github.com/cytex-media-solutions/klara-js/actions/workflows/build-and-test.yml)
[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub issues](https://img.shields.io/github/issues/cytex-media-solutions/klara-js)]()
[![GitHub pull requests](https://img.shields.io/github/issues-pr/cytex-media-solutions/klara-js)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)
[![codecov](https://codecov.io/gh/cytex-ch/klara-js/graph/badge.svg?token=P7TXWCFFB5)](https://codecov.io/gh/cytex-ch/klara-js)

</div>

<br/>

<div align="center" style="margin-bottom: 20px; background-color: #FFF; border-radius: 5px; padding: 20px; color: #000;">
        ⚠️ This project is still in development and not ready for production use. ⚠️<br/>
        Can't wait to use it? Feel free to
        <a href="./CONTRIBUTE.md">contribute</a>.
</div>

<br/>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installing](#installing)
- [License](#license)
- [Tests](#tests)
- [Usage](#usage)
- [Built Using](#built_using)
- [Authors](#authors)

## 🧐 About

<a name="about"></a>

<strong>klara-js</strong> allows you to easily fetch physical snail mail from your ePost/Klara account. Additionally, you can also manage your snail mail by creating, updating and deleting it.

### ⚠️ Disclaimer

This project is not affiliated with Swiss Post or Klara in any way. It is an unofficial API wrapper for the Klara API. Use at your own risk. We are not responsible for any damage caused by the use of this library.

## 🏁 Features

<a name="features"></a>

- Search
- Fetch
- Download
- Create

## 🏁 Getting Started

<a name="getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

<a name="prerequisites"></a>

Please make sure you have installed the following tools:

- [Node.js](https://nodejs.org/en/) - JavaScript runtime environment
- [TypeScript](https://www.typescriptlang.org/) - Typescript compiler
- A [epost.ch](https://www.epost.ch) account whose address is verified and has enabled Scanning Services.

And a package manager of your choice:

- [npm](https://www.npmjs.com/) - Node.js package manager
- [yarn](https://yarnpkg.com/) - Node.js package manager

### Installing

<a name="installing"></a>

Install the package via npm:

```bash
npm install klara-js --save
```

or via yarn:

```bash
yarn add klara-js
```

## 🎈 Usage

<a name="usage"></a>

### Basic usage

```typescript
import Klara from 'klara-js';

// Create a new instance
const klara = new Klara('username', 'password');

// Fetch tenants (optional, defaults to first tenant)
const tenants = await klara.user.tenants();
klara.use(tenants[0]);

// Login
await klara.login();

// Fetch all letters
await klara.letterbox.find();

// Fetch a specific letter
await klara.letterbox.findOne("letter-id");

// Remove a letter
await klara.letterbox.delete("letter-id");

// Download a letter
await klara.letterbox.download("letter-id", "./letter.pdf");

```

## 📜 License

<a name="license"></a>

In the vast realm of code, where ideas intertwine and innovation knows no bounds, I find myself continually amazed by the unwavering spirit of collaboration that defines the open source community. It's a world where developers, like you and me, share their creations, their insights, and their expertise with an unparalleled generosity. Countless times, whether through serendipitous discovery or through meticulous research, I've stumbled upon remarkable projects that have enriched my own journey as a developer.

Recognizing the profound impact that the open source community has had on my own growth, I've made a personal commitment to give back to this tapestry of ingenuity. The code is licensed under the <strong>APGL license</strong>, which means that you're free to use, remix, and build upon it. It's my way of extending the thread of collaboration that binds us as developers.

However, I also understand the diverse needs that drive us in this community. If you're considering utilizing this project for commercial purposes in which copyleft is no option, <string>I invite you to reach out</string>. While there isn't a fixed license model in place, I believe in the power of optimism and negotiation. Let's work together to find a solution that aligns with your goals while respecting the effort and intent behind this work.


## 🔧 Running the tests

<a name="tests"></a>

Tests are written with jest. You can run them with the following command:

```bash
npm run test
```

## ⛏️ Built Using

<a name="built_using"></a>

- [TypeScript](https://www.typescriptlang.org/) - Programming language
- [Jest](https://jestjs.io/) - Testing framework
- [Prettier](https://prettier.io/) - Code formatter
- [ESLint](https://eslint.org/) - Linter

## ✍️ Authors

<a name="authors"></a>

- [@cytex-media-solutions](https://github.com/cytex-media-solutions) - Project author
- [@sjutz](https://github.com/sjutz) - Project maintainer <simon.jutz@cytex.ch>
