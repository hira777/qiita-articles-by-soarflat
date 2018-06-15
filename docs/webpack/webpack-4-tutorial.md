# webpack 4 入門

webpack に関して説明する機会があったため、それらに関してまとめました。

- 「gulp は使ってるけど webpack はちょっと...」
- 「webpack.config.js の中身を見てみたが、何を書いているのか理解できなくて諦めた」
- 「何が便利なのかよくわからない」
- 「別に webpack 使わなくても実装はできるから必要なくない？」

といった人達向けに書いた記事であり、

- webpack に関しての基本情報、利用用途、機能を理解する。
- そもそもモジュールバンドラとは何か、なぜモジュールバンドラを利用するのかを理解する。

ことを目的としています。

解説に利用しているコードの最終形態は GitHub 上にあります。

[webpack-4-tutorial](https://github.com/hira777/webpack-4-tutorial)

webpack のバージョン 1 系と 3 系の解説、コードは以下に移動しましたので、必要であればご参照ください。

- [webpack-v1-tutorial](https://github.com/soarflat-sandbox/webpack-v1-tutorial)
- [webpack-v3-tutorial](https://github.com/soarflat-sandbox/webpack-v3-tutorial)

## 本記事の前提や注意点

- webpack のバージョンは 4 系（webpack 4）を対象にしています。
- gulp を触ったことがある人向けの記事なので`npm install`など npm に関する説明は省きます。
- webpack とモジュールバンドラに関しての記事なので gulp で webpack を利用する方法は記載していないです。
- webpack は画像や CSS などもモジュールにしてまとめることができますが、今回は JavaScript に焦点を当てた説明をしています。

## webpack とは

モジュールバンドラのこと。

### モジュールバンドラとは

複数のモジュールを 1 つにまとめたファイルを出力するツールのこと（簡潔に言ってしまえば）。
※出力設定によっては複数のファイルを出力することもあります。

webpack 以外に、以下のようなモジュールバンドラが存在する。

- Browserify
- RequireJS

### webpack（モジュールバンドラ）関連の記事でよく利用されている用語

#### モジュール

機能ごとに分割されたファイルのこと。
そのため、webpack は「複数のファイルをまとめたファイル」を出力するツールと認識しておけばとりあえずは問題ない。

#### バンドル

まとめられたファイルのこと。バンドルファイルとも言う。
そのため、以下の言葉の意味は大体同じ。

- 「バンドルが大きい」 = 「まとめられたファイルのサイズが大きい」
- 「バンドルを生成する」 = 「まとめられたファイルを生成する」

#### バンドルする

「まとめる」という意味で使われていることが多い。
そのため、以下の言葉の意味は大体同じ。

- 「モジュールをまとめる」 = 「モジュールをバンドルする」

#### ビルド

webpack においての「ビルド」は「バンドルを出力するまでの一連の処理」という意味で使われていることが多い（気がする）。
そのため、以下の言葉の意味は大体同じ。

- 「ビルドする」 = 「バンドルを出力するまでの一連の処理を実行する」
- 「ビルドが遅い」 = 「バンドルを出力するまでの一連の処理が遅い」

## webpack を利用してみる

webpack を利用してモジュールをバンドルしたファイルを出力してみる。
以下は出力までのイメージ図。

<img :src="$withBase('/webpack/webpack-4-tutorial/build-process.jpg')" alt="build image">

### webpack のインストール

以下のコマンドでグローバルインストールできる。

```bash
npm install webpack -g
```

しかし、グローバルインストールは今回 webpack を利用したいディレクトリ（プロジェクト）以外の全ての環境に影響を及ぼすため、ローカルインストールをして利用した方が良い。
ローカルインストール方法と、ローカルインストールした webpack などの package の実行方法は後述する。

### ディレクトリ構成

今回 webpack を利用するディレクトリ構成は以下を前提とする。

```
.
├── package.json
├── public
│   ├── index.html
│   └── js
│       └── bundle.js
├── src
│   └── js
│       ├── app.js
│       └── modules
│           ├── addition-calculator.js
│           └── tax-calculator.js
└── webpack.config.js
```

いくつかのパッケージをローカルインストールするため、`package.json`は以下のコマンドで生成する。

```bash
npm init -y
```

or

```bash
yarn init -y
```

### webpack のローカルインストール

上記構成のルートで以下のコマンドを実行すれば webpack がローカルインストールされる。
後述するプラグインの利用で必要なため、グローバルだけではなくローカルにもインストールしておく。

```bash
npm install webpack --save-dev
```

or

```bash
yarn add webpack --dev
```

### webpack-cli のインストール

`webpack`コマンドで webpack を実行するために、以下のコマンドで webpack-cli をインストールする（webpack 4 から必要になった）。

```bash
npm install webpack-cli --save-dev
```

or

```bash
yarn add webpack-cli --dev
```

#### ローカルインストールした package（今回は webpack-cli）を実行するために PATH を通す

現状のままだと、ローカルインストールが成功しても`webpack`コマンドを実行できないため、以下のように PATH を通す必要がある。

```bash
export PATH=$PATH:./node_modules/.bin
```

※「PATH を通す」が不明な方は以下をご覧ください。

- [PATH を通すとは？ (Mac OS X)](http://qiita.com/soarflat/items/09be6ab9cd91d366bf71)
- [PATH を通すために環境変数の設定を理解する (Mac OS X)](http://qiita.com/soarflat/items/d5015bec37f8a8254380)

### 各ファイルの詳細

#### `webpack.config.js`（webpack の設定ファイル）

webpack を利用するためには`webpack.config.js`というファイルに設定を記述する必要がある。
今回の設定は以下の通り。

```js
// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');

module.exports = {
  // モードの設定、v4系以降はmodeを指定しないと、webpack実行時に警告が出る
  mode: 'development',
  // エントリーポイントの設定
  entry: './src/js/app.js',
  // 出力の設定
  output: {
    // 出力するファイル名
    filename: 'bundle.js',
    // 出力先のパス（v2系以降は絶対パスを指定する必要がある）
    path: path.join(__dirname, 'public/js'),
  },
};
```

各項目の詳細は以下の通り。

##### `mode`

モード（webpack 4 から追加された項目）の設定。
モードは`development`、`production`、`none`が存在する。

`development`か`production`を指定すると、様々な設定が有効になって webpack が実行される。
例えば、`production`にすれば`optimization.minimizer`という設定が有効になり、圧縮されたファイルが出力される。

設定は上書き可能であり、上書きしたい項目は`webpack.config.js`に記述する（詳細は後述）。

##### `entry`

エントリーポイントの設定。複数設定することも可能。
エントリーポイントとはモジュール間の依存関係の解析を開始する地点のこと。
各モジュールを読み込んでメインの処理をする JavaScript ファイルだと認識しておけば良い。

##### `output`

出力の設定。
出力するファイル名や出力先のパスを指定する。
OS によってパスが異なることを防ぐために、出力先のパスの指定には`path.join()`を利用する。

#### `app.js`（エントリーポイント）

2 つのアイテムの価格を合算し、消費税込みの価格を出力をするエントリーポイント。
`import`という構文でモジュールを読み込んで利用できるため、`addition-calculator.js`と`tax-calculator.js`モジュールを`import`で読み込んで利用している。

```js
import additionCalculator from './modules/addition-calculator';
import taxCalculator from './modules/tax-calculator';

var item1Price = 400;
var item2Price = 600;
var totalPrice = additionCalculator(item1Price, item2Price);
var tax = 1.08;
var priceIncludeTax = taxCalculator(totalPrice, tax);

console.log(priceIncludeTax);
```

#### `addition-calculator.js`（モジュール）

引数の`number1`と`number2`を合算して返すモジュール。
`import`で読み込んで利用するためには、モジュールを定義する必要がある。
そのため`export default`で`additionCalculator`をモジュールとして定義している。

```js
export default function additionCalculator(number1, number2) {
  return number1 + number2;
}
```

#### `tax-calculator.js`（モジュール）

引数`price`と`tax`を乗算して返すモジュール。
`addition-calculator.js`と同様に`export default`で`taxCalculator`をモジュールとして定義している。

```js
export default function taxCalculator(price, tax) {
  return Math.round(price * tax);
}
```

### `webpack`コマンドでバンドルされたファイルを出力

上記構成の`webpack.config.js`が存在する階層で`webpack`コマンドを実行すれば、バンドルされたファイルが出力される。
今回の設定だと`bundle.js`という名前のファイルが`public/js/`に出力される。

```bash
webpack

# 以下のような実行結果が出力される。
Hash: 46c490c9c2dbab33462c
Version: webpack 4.1.1
Time: 77ms
Built at: 2018-3-12 17:58:29
    Asset      Size  Chunks             Chunk Names
bundle.js  4.86 KiB    main  [emitted]  main
Entrypoint main = bundle.js
[./src/js/app.js] 324 bytes {main} [built]
[./src/js/modules/addition-calculator.js] 92 bytes {main} [built]
[./src/js/modules/tax-calculator.js] 87 bytes {main} [built]
```

出力された`bundle.js`の記述は以下のようになっている（一部記述省略）。

```js
/******/ ({
  /***/ './src/js/app.js':
    /*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
    /*! no exports provided */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      eval(
        '__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _modules_addition_calculator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modules/addition-calculator */ "./src/js/modules/addition-calculator.js");\n/* harmony import */ var _modules_tax_calculator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/tax-calculator */ "./src/js/modules/tax-calculator.js");\n\n\n\nvar item1Price = 400;\nvar item2Price = 600;\nvar totalPrice = Object(_modules_addition_calculator__WEBPACK_IMPORTED_MODULE_0__["default"])(item1Price, item2Price);\nvar tax = 1.08;\nvar priceIncludeTax = Object(_modules_tax_calculator__WEBPACK_IMPORTED_MODULE_1__["default"])(totalPrice, tax);\n\nconsole.log(priceIncludeTax);\n\n//# sourceURL=webpack:///./src/js/app.js?'
      );

      /***/
    },

  /***/ './src/js/modules/addition-calculator.js':
    /*!***********************************************!*\
  !*** ./src/js/modules/addition-calculator.js ***!
  \***********************************************/
    /*! exports provided: default */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      eval(
        '__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return additionCalculator; });\nfunction additionCalculator(number1 ,number2) {\n  return number1 + number2;\n}\n\n//# sourceURL=webpack:///./src/js/modules/addition-calculator.js?'
      );

      /***/
    },

  /***/ './src/js/modules/tax-calculator.js':
    /*!******************************************!*\
  !*** ./src/js/modules/tax-calculator.js ***!
  \******************************************/
    /*! exports provided: default */
    /***/ function(module, __webpack_exports__, __webpack_require__) {
      'use strict';
      eval(
        '__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return taxCalculator; });\nfunction taxCalculator(price ,tax) {\n  return Math.round(price * tax);\n}\n\n//# sourceURL=webpack:///./src/js/modules/tax-calculator.js?'
      );

      /***/
    },

  /******/
});
```

モジュールがバンドルされていることがわかる。
また、以下のような`bundle.js`を読み込んでいる html ファイルをブラウザで開き、コンソールを確認してみると正常に動作していることがわかる。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>webpack tutorial</title>
</head>
<body>
<script src="js/bundle.js"></script>
</body>
</html>
```

<img :src="$withBase('/webpack/webpack-4-tutorial/bundle.jpg')" alt="bundle">

#### モジュールがバンドルされたファイルを出力できたが

これだけだと webpack（モジュールバンドラ）の何が良いのかがわからないため、メリットやなぜ利用するのかを説明していく。

## なぜ webpack（モジュールバンドラ）を利用するのか

- 機能ごとにファイルを分割（モジュール化）する開発ができるから
- 自分が作成したモジュールだけではなく、外部モジュール（npm などでインストールできるパッケージなど）も利用できるから
- リクエスト数を減らせるから
- 依存関係を解決したファイルを出力できるから

などモジュールの開発、再利用、バンドルなどが魅力的だから。

### 機能ごとにファイルを分割（モジュール化）する開発ができる

ファイルを分割（モジュール化）する開発には以下のようなメリットがある。

- コードが見やすくなる（可読性の向上）
- 開発作業の分担やテストがし易くなる
- 名前空間を生成できる（変数の競合やグローバル汚染を防ぐ）
- モジュールの保守性を高められる
- モジュールの再利用性を高められる

#### コードが見やすくなる（可読性の向上）

1 つのファイルに複数の機能が書かれたコードよりも、1 つのファイルに 1 つの機能が書かれたコードの方が見やすい。

#### 開発作業の分担やテストが容易になる

1 つのファイルに複数の機能が集中している場合、機能毎に担当を分けるなどの作業分担がし辛いし、テストもし辛い。
機能ごとにファイルを分割していれば、作業分担やテストがし易い。

#### 名前空間を生成できる（変数の競合やグローバル汚染を防ぐ）

モジュール毎に名前空間を割り当てれば、変数の競合やグローバル汚染を防げる。

#### モジュールの保守性を高められる

モジュールは他のコードとの依存性が少なくあるべきなので、しっかり設計をすれば変更や拡張がしやすくなる。
ファイルを分割すればモジュールになるわけではなく、あるモジュールを修正するために他のコードに大きな影響を与える場合、それはモジュールとは言えないため注意。

#### モジュールの再利用性を高められる

汎用性の高いモジュールを開発すれば再利用できて便利。
コードをコピペで再利用する場合だと、修正時にコピペしたファイルを全て修正する必要があるが、モジュールとしてファイルを分割しておけば 1 つのファイルを修正するだけで済む。

### 自分が作成したモジュールだけではなく、外部モジュール（npm などでインストールできるパッケージなど）も利用できる

試しに外部モジュールの jQuery を利用してみる。まずは`jquery`をローカルインストールする。

```bash
npm install jquery --save
```

or

```bash
yarn add jquery
```

インストールしたパッケージは他のモジュール同様、`import`で読み込みモジュールとして利用できる。

```js
import $ from 'jquery';
import additionCalculator from './modules/addition-calculator';
import taxCalculator from './modules/tax-calculator';

var item1Price = 400;
var item2Price = 600;
var totalPrice = additionCalculator(item1Price, item2Price);
var tax = 1.08;
var priceIncludeTax = taxCalculator(totalPrice, tax);

console.log(priceIncludeTax);
$('body').html(priceIncludeTax);
```

上記の状態で`webpack`コマンドを実行すると`jquery`もバンドルされたファイルが出力される。

```bash
webpack

# 以下のような実行結果が出力される。
Hash: 0929c9cb73f6110bfb50
Version: webpack 4.1.1
Time: 245ms
Built at: 2018-3-12 18:21:28
    Asset     Size  Chunks                    Chunk Names
bundle.js  302 KiB    main  [emitted]  [big]  main
Entrypoint main [big] = bundle.js
[./src/js/app.js] 381 bytes {main} [built]
[./src/js/modules/addition-calculator.js] 92 bytes {main} [built]
[./src/js/modules/tax-calculator.js] 87 bytes {main} [built]
    + 1 hidden module
```

`bundle.js`を読み込んでいる html ファイルをブラウザで確認してみると、jQuery もバンドルされて正常に動作していることがわかる。

<img :src="$withBase('/webpack/webpack-4-tutorial/bundle2.jpg')" alt="bundle2">

外部モジュールを利用できたが、

- 「わざわざファイルをまとめずに、script タグで jQuery 読み込めば良いのでは？」

と思った方は多々いると思うのし、確かにちょっとしたコードを書く程度ならそちらの方が楽。
しかし、後述するメリットを考慮すると jQuery のような外部モジュールもバンドルした方が良い時もある。

### リクエスト数を減らせる

以下は jQuery を読み込み、jQuery に依存している`app.js`を読み込んでいる html ファイルだと想定する。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>webpack tutorial</title>
</head>
<body>
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script src="js/app.js"></script>
</body>
</html>
```

上記のようなファイルは以下の懸念点がある。

- 現在は 1 つのライブラリだけ読み込んでいるが、必要なライブラリが増えてリクエスト数が増える可能性がある（リクエスト数の増加はパフォーマンス上良くない）。

webpack を利用すればファイルをバンドルできるため、リクエスト数を減らせる。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>webpack tutorial</title>
</head>
<body>
<!-- jQueryもバンドルされたファイル -->
<script src="js/bundle.js"></script>
</body>
</html>
```

しかし、全てのファイルを 1 つにバンドルする場合、以下の懸念点が考えられる。

- ファイルサイズが非常に大きくなり読み込み時間がかかる。

バンドルしたファイルを分割して出力したり、それらのファイルを非同期読み込みするなどの機能があるのでそれらを利用する。

- キャッシュを活用できない。

ライブラリは頻繁に変更しないファイルのため、キャッシュを活用すべきだが、全てのファイルを 1 つにバンドルするとそれができない。
そのため、頻繁に変更するファイルのバンドルと、ライブラリ群をまとめたバンドルは別にして出力する（`optimization.splitChunks`という設定を有効にする必要がある）。

### 依存関係を解決したファイルを出力できる

以下は jQuery を読み込み、jQuery に依存している`app.js`を読み込んでいる html ファイルだと想定する。
`app.js`は jQuery に依存しているため、jQuery を読み込む前に`app.js`を読み込むと動かない。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>webpack tutorial</title>
</head>
<body>
<!-- app.jsはjQueryに依存しているため、jQueryを読み込んだ後に読み込む必要がある。 -->
<script src="https://code.jquery.com/jquery-3.1.1.min.js"></script>
<script src="js/app.js"></script>
</body>
</html>
```

上記のようなファイルは以下の懸念点がある。

- 依存しているライブラリが 1 つだけなら良いが、依存が増えれば増えるほど依存関係がわかり辛くなる。
- それぞれのファイルの依存関係をすぐに理解できるのは作業をした人間のみであり、別の作業者が依存関係をすぐに理解するのは困難。
- 依存関係が複雑になればなるほど、迂闊にスクリプトの読み込み順を変更したり本来不要なファイルを削除できなくなる。

webpack を利用すれば依存関係を解決してファイルをバンドルするため、スクリプトの順番を考慮する必要はなくなり依存関係に悩まされる可能性は低くなる。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>webpack tutorial</title>
</head>
<body>
<!-- 依存関係を解決してまとめられたファイル -->
<script src="js/bundle.js"></script>
</body>
</html>
```

また、依存するパッケージ（モジュール）を`package.json`に明記し、それらの利用を促せば以下のような事態に陥る可能性は低くなる。

- 理由もなく作業者によって利用するライブラリのバージョンが異なる。
- 1 ページに同じライブラリが複数読み込まれてしまっている。
- 同じライブラリが様々なディレクトリに存在する。誰がどこで何のために利用しているのかわからないため迂闊に消せない。

### webpack（モジュールバンドラ）の使いどころ

上記のメリットや機能が必要に感じたり、魅了に感じる状況であれば利用すべき。
逆にすぐに捨てるコードや 2〜30 行程度のコンパクトなコードを書く程度なら必要ないと思う。

webpack は非常に多くの機能が存在し、細かい設定ができるため`webpack.config.js`の内容を理解せずにコピペして利用するはやめた方が良い。
利用用途に合わせて`webpack.config.js`を用意するべき。

とは言え、全ての機能を完全に理解するのは困難なので、頻繁に利用しそうな機能や、webpack 4 から追加された`mode`などの設定項目を紹介をしていく。

## webpack の様々な機能、設定項目

### watch モード

ファイルを監視して変更があったらビルドを再実行する機能のこと。
watch モードでは基本的にキャッシュが有効になるため、ビルド時間が短くなる。
オプションを指定して`webpack`コマンドを実行するか、`webpack.config.js`に設定を記述することで利用できる。

```bash
webpack --watch
```

```js
const path = require('path');

module.exports = {
  // watchモードを有効にする
  watch: true,
  mode: 'development',
  entry: './app.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public/js'),
  },
};
```

### ローダー

画像や CSS などの JavaScript 以外のファイルを JavaScript で扱えるように変換したり、バンドルする前にモジュールに対して実行する機能のこと。
TypeScript を JavaScript に変換、画像を DataURL に変換、コードをチェックするなど、ローダーによって機能は様々。

#### `babel-loader`

ES2015（ES6）のコードを ES5 のコードに変換するローダー。

ローダーを利用するためにはそれに応じたパッケージをインストールしておく必要がある。
`babel-loader`を利用するために以下のパッケージをインストールする。

```bash
npm install babel-loader babel-core babel-preset-env --save-dev
```

or

```bash
yarn add babel-loader babel-core babel-preset-env --dev
```

インストール後、`webpack.config.js`に`babel-loader`の設定を追加する。

```js
// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');

module.exports = {
  // モードの設定、v4系以降はmodeを指定しないと、webpack実行時に警告が出る
  mode: 'development',
  // エントリーポイントの設定
  entry: './src/js/app.js',
  // 出力の設定
  output: {
    // 出力するファイル名
    filename: 'bundle.js',
    // 出力先のパス（v2系以降は絶対パスを指定する必要がある）
    path: path.join(__dirname, 'public/js'),
  },
  // ローダーの設定
  module: {
    rules: [
      {
        // ローダーの処理対象ファイル
        test: /\.js$/,
        // ローダーの処理対象から外すディレクトリ
        exclude: /node_modules/,
        use: [
          {
            // 利用するローダー
            loader: 'babel-loader',
            // ローダーのオプション
            // 今回はbabel-loaderを利用しているため
            // babelのオプションを指定しているという認識で問題ない
            options: {
              presets: [['env', { modules: false }]],
            },
          },
        ],
      },
    ],
  },
};
```

上記の設定で`webpack`コマンドを実行すれば、以下のような ES2015（ES6）のコードをどのブラウザでも動くように変換してくれる。

```js
import $ from 'jquery';
import additionCalculator from './modules/addition-calculator';
import taxCalculator from './modules/tax-calculator';

const item1Price = 400;
const item2Price = 600;
const totalPrice = additionCalculator(item1Price, item2Price);
const tax = 1.08;
const priceIncludeTax = taxCalculator(totalPrice, tax);

console.log(priceIncludeTax);
$('body').html(priceIncludeTax);
```

#### `eslint-loader`

JavaScript のコードを検証するローダー。

`eslint-loader`を利用するために以下のパッケージをインストールする。

```bash
npm install eslint eslint-loader --save-dev
```

or

```bash
yarn add eslint eslint-loader --dev
```

インストール後、`webpack.config.js`に`eslint-loader`の設定とプラグインの記述を追加する。

```js
// プラグインを利用するためにwebpackを読み込んでおく
const webpack = require('webpack');

// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');

module.exports = {
  // モードの設定、v4系以降はmodeを指定しないと、webpack実行時に警告が出る
  mode: 'development',
  // エントリーポイントの設定
  entry: './src/js/app.js',
  // 出力の設定
  output: {
    // 出力するファイル名
    filename: 'bundle.js',
    // 出力先のパス（v2系以降は絶対パスを指定する必要がある）
    path: path.join(__dirname, 'public/js'),
  },
  // ローダーの設定
  module: {
    rules: [
      {
        // ローダーの処理対象ファイル
        test: /\.js$/,
        // ローダーの処理対象から外すディレクトリ
        exclude: /node_modules/,
        use: [
          {
            // 利用するローダー
            loader: 'babel-loader',
            // ローダーのオプション
            // 今回はbabel-loaderを利用しているため
            // babelのオプションを指定しているという認識で問題ない
            options: {
              presets: [['env', { modules: false }]],
            },
          },
        ],
      },
      {
        // enforce: 'pre'を指定することによって
        // enforce: 'pre'がついていないローダーより早く処理が実行される
        // 今回はbabel-loaderで変換する前にコードを検証したいため、指定が必要
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
  },
};
```

`babel-loader`の設定記述とほとんど変わりないが、`babel-loader`で変換する前にコードを検証したいため`enforce: 'pre'`を指定する。

また、`eslint`の設定ファイルである`.eslintrc`も追加する。
※webpack の解説記事のため、設定項目の詳細は割愛します。

```json
{
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "env": {
    "browser": true
  }
}
```

`.eslintrc`は`package.json`と同じ階層に追加するため、ディレクトリ構成は以下の通り。

```
.
├── .eslintrc
├── package.json
├── public
│   ├── index.html
│   └── js
│       └── bundle.js
├── src
│   └── js
│       ├── app.js
│       └── modules
│           ├── addition-calculator.js
│           └── tax-calculator.js
└── webpack.config.js
```

上記の設定で`webpack`コマンドを実行すれば、以下のように検証結果が出力される。

```bash
ERROR in ./src/js/app.js

/Users/mac/GitHub/webpack-v4-tutorial/src/js/app.js
  11:1  error  Unexpected console statement  no-console
```

#### ローダーを設定する書き方は色々ある

ローダーを設定する書き方は色々あり、上記の`babel-loader`の設定は以下のようにも書ける。

```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader?{ "presets":[["env", {"modules": false}]] }',
        },
      ],
    },
  ];
}
```

以下のように`use`を省略して書くこともできる。

```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: [['env', { modules: false }]],
      },
    },
  ];
}
```

以下のように`use`を利用すると、ローダーを複数指定すること等が可能なため、状況に応じて使い分ける。

```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [['env', { modules: false }]],
          },
        },
        {
          loader: 'jshint-loader',
        },
      ],
    },
  ];
}
```

### プラグイン

モジュールのバンドル時に実行される様々な処理のこと。

#### `ProvidePlugin`

指定したモジュールをすべてのファイル（モジュール）の変数として利用可能にするプラグイン。
利用可能にしたモジュールは`import`などで読み込む必要がなくなる。
以下は`webpack.config.js`に`ProvidePlugin`を追加したもの。

```js
// プラグインを利用するためにwebpackを読み込んでおく
const webpack = require('webpack');

// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');

module.exports = {
  // モードの設定、v4系以降はmodeを指定しないと、webpack実行時に警告が出る
  mode: 'development',
  // エントリーポイントの設定
  entry: './src/js/app.js',
  // 出力の設定
  output: {
    // 出力するファイル名
    filename: 'bundle.js',
    // 出力先のパス（v2系以降は絶対パスを指定する必要がある）
    path: path.join(__dirname, 'public/js'),
  },
  // ローダーの設定
  module: {
    rules: [
      {
        // ローダーの処理対象ファイル
        test: /\.js$/,
        // ローダーの処理対象から外すディレクトリ
        exclude: /node_modules/,
        use: [
          {
            // 利用するローダー
            loader: 'babel-loader',
            // ローダーのオプション
            options: {
              presets: [['env', { modules: false }]],
            },
          },
        ],
      },
      {
        // enforce: 'pre'を指定することによって
        // enforce: 'pre'がついていないローダーより早く処理が実行される
        // 今回はbabel-loaderで変換する前にコードを検証したいため、指定が必要
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
  },
  // プラグインの設定
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
    }),
  ],
};
```

`jquery`を全てのモジュール上で変数`$`として利用できるようにしたため、`app.js`の`jquery`を読み込む記述を消しても正常に動作する。

```js
import additionCalculator from './modules/addition-calculator';
import taxCalculator from './modules/tax-calculator';

const item1Price = 400;
const item2Price = 600;
const totalPrice = additionCalculator(item1Price, item2Price);
const tax = 1.08;
const priceIncludeTax = taxCalculator(totalPrice, tax);

console.log(priceIncludeTax);
$('body').html(priceIncludeTax);
```

### `mode`

webpack 4 から新しく追加された設定項目。
`mode`には`development`、`production`、`none`が存在し、いずれかを指定しないと webpack 実行時に警告がでる。

`development`か`production`を指定すると様々な設定が有効になり、webpack が実行される。

オプションを指定して`webpack`コマンドを実行するか、`webpack.config.js`に設定を記述することで`mode`を指定できる。

```bash
webpack --mode development
```

```js
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './app.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public/js'),
  },
};
```

#### `development`

エラー表示、デバッグしやすいファイルの出力、再ビルド時間の短縮（キャッシュ有効）などの設定が有効になる。

開発時のファイルの出力にはこちらのモードを利用する。

#### `production`

ファイルの圧縮や、モジュールの最適化などの設定が有効になる。

本番時のファイルの出力にはこちらのモードを利用する。

#### `npm scripts`で webpack をそれぞれのモードで実行する

`mode`を`webpack.config.js`に記述してしまうと、モードを変更する度に記述を変更する必要がある。

それを防ぐために`npm scripts`で webpack を実行できるようにする。そのために`package.json`に以下の記述を追加する。

```json
"scripts": {
  "dev": "webpack --mode development --watch",
  "build": "webpack --mode production"
}
```

記述後の`package.json`は以下のようになる。

```json
{
  "name": "webpack-4-tutorial",
  "version": "1.0.0",
  "description": "webpack 4 quick start",
  "author": "soraflat",
  "scripts": {
    "dev": "webpack --mode development --watch",
    "build": "webpack --mode production"
  },
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.4",
    "babel-preset-env": "^1.7.0",
    "eslint": "^4.19.1",
    "eslint-loader": "^2.0.0",
    "webpack": "^4.8.3",
    "webpack-cli": "^2.1.3"
  },
  "dependencies": {
    "jquery": "^3.2.1"
  },
  "license": "MIT"
}
```

上記の記述で以下のコマンドを実行するとそれぞれのモードで webpack が実行される。

**以下のコマンドで`webpack --mode development --watch`が実行される。**

```bash
npm run dev
```

or

```bash
yarn run dev
```

**以下のコマンドで`webpack --mode production`が実行される。**

```bash
npm run build
```

or

```bash
yarn run build
```

`eslint-loader`などを利用している場合、エラーを直さないとビルドできないため注意。

#### 設定の上書き

`webpack.config.js`に設定を追記すれば、それぞれのモードで有効になる設定を上書きできる。

##### `development`の上書き例

以下は`development`モードで有効になる`devtool: 'eval'`を上書きした例。

```js
module.exports = {
  mode: 'development',
  entry: './src/js/app.js',
  output: {
    filename: 'bundle.js',
    path: './public/js',
  },
  // developmentモードで有効になるdevtool: 'eval'を上書き
  devtool: 'source-map',
};
```

出力されるソースマップが変更される。

##### `production`の上書き例

以下は`production`モードで有効になる`optimization.minimizer`を上書きした例。

```js
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/js/app.js',
  output: {
    filename: 'bundle.js',
    path: './public/js',
  },
  // productionモードで有効になるoptimization.minimizerを上書きする
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
};
```

圧縮されるだけではなく、`console`も削除されたファイルが出力される。

#### `mode`によって設定を切り替える

- 「`production`モードでビルドする場合は`console`を消したいが、`development`モードでは残しておきたい。」
- 「`development`モードの場合のみ、ソースマップを出力したい。」

などの状況で、`mode`によって設定を切り替えたい時がある。

以下のように変更すれば、`mode`によって設定を切り替えられる。

```js
// プラグインを利用するためにwebpackを読み込んでおく
const webpack = require('webpack');

// optimization.minimizerを上書きするために必要なプラグイン
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');

module.exports = (env, argv) => {
  // argv.modeにはwebpackを実行したmodeが格納されている
  // 例えば webpack --mode development と実行すれば
  // argv.mode には 'development' が格納されている
  // そのためdevelopmentモードで実行したかどうかを判定できる
  const IS_DEVELOPMENT = argv.mode === 'development';

  return {
    // エントリーポイントの設定
    entry: './src/js/app.js',

    ///
    /// outputなどの記述は省略
    ///

    // developmentモードで有効になるdevtool: 'eval'を上書き
    // developmentモードでビルドした時だけソースマップを出力する
    devtool: IS_DEVELOPMENT ? 'source-map' : 'none',
    // productionモードで有効になるoptimization.minimizerを上書きする
    optimization: {
      // developmentモードでビルドした場合
      // minimizer: [] となるため、consoleは残されたファイルが出力される
      // puroductionモードでビルドした場合
      // minimizer: [ new UglifyJSPlugin({... となるため、consoleは削除したファイルが出力される
      minimizer: IS_DEVELOPMENT
        ? []
        : [
            new UglifyJSPlugin({
              uglifyOptions: {
                compress: {
                  drop_console: true
                }
              }
            })
          ]
    }
  };
};
```

### `optimization.splitChunks`

webpack 3 までに存在した CommonsChunkPlugin に代わる設定項目。

※詳細は別の記事に書きましたので、こちらを参考にしてください。

[webpack 4 から追加された optimization.splitChunks の使い方、使い所](https://qiita.com/soarflat/items/1b5aa7163c087a91877d)

## webpack 3 から 4 への移行の注意点

webpack 4 に対応していないプラグインやローダーが動かなくなる可能性があるため、移行する前にチェックをする。

## 終わり

今後もフロントエンド開発は大規模かつ複雑になると思うのでモジュール化を考慮した開発は普段から意識しておいて損はないです。
とは言え、いきなり自分でモジュールを開発するのも難しいと思うため、まずは外部モジュールの利用から始めてみると良いと思います。

webpack 4 の情報は現時点（2018/03/15）ではドキュメントにまとめられていないため、以下の記事に目を通すことをオススメいたします。

- [次のリリースである webpack 4 の主な変更点まとめ](http://abouthiroppy.hatenablog.jp/entry/2017/12/25/100004)
- [webpack4 への簡単なマイグレーションガイド](http://abouthiroppy.hatenablog.jp/entry/migrate-to-webpack4)
- [webpack 4: released today!!](https://medium.com/webpack/webpack-4-released-today-6cdb994702d4)
- [webpack 4: mode and optimization](https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a)

### Parcel に関して

話題になった Parcel（モジュールバンドラ）を触りましたが、実務では引き続き webpack を利用することになりそうです。
記事を書きましたので、興味があればこちらもどうぞ。

[Parcel 入門 ～ Parcel は webpack の代わりになるのか～](https://qiita.com/soarflat/items/3e43368b2d767c730781)
