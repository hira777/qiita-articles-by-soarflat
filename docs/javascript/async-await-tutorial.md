# async/await 入門

今更ですが、JavaScript の`async`/`await`に関する備忘録になります。

- 「今まで`$.Deferred()`や`Promise`などで非同期処理は書いたことがあるが、`async`/`await`はわからない」
- 「`$.Deferred()`や`Promise`などの非同期処理の書き方より、もっと簡潔に書ける書き方があれば知りたい」
- 「今までの非同期処理の書き方と比べて何が良いのかわからない」

といった人達向けの記事です。

`$.Deferred()`や`Promise`などで非同期処理を書いたことがある前提のため、非同期処理自体に関する説明は記載しておりません。
記載している利用例のコードは Chrome（最新）のコンソール上で動きますので、コンソール上で実行して動作を確認してみると理解が深まりやすいと思います。

## 本記事で用いている用語

### `Promise`を返す

`Promise`オブジェクトを返すこと。

```javascript
// Promiseを返す
return new Promise((resolve, reject) => {});
```

### `Promise`の結果を返す

`Promise`の`resolve`もしくは`reject`を実行すること。

```javascript
return new Promise((resolve, reject) => {
  // Promiseの結果を返す
  resolve('resolve!!');
});
```

### `resolve`する

`Promise`の`resolve`を実行すること。

```javascript
return new Promise((resolve, reject) => {
  // succes!!をresolveする
  resolve('succes!!');
});
```

### `reject`する

`Promise`の`reject`を実行すること。

```javascript
return new Promise((resolve, reject) => {
  // err!!をrejectする
  reject('err!!');
});
```

## `async`/`await`とは

`async`と`await`を利用した、非同期処理の構文のこと。

### 何故`async`/`await`を利用するのか

**`Promise`を利用した構文よりも、簡潔に非同期処理が書けるから。**

### `async`/`await`の対応状況

以下は各ブラウザの`async`/`await`の対応状況。

[ECMAScript 2016+ compatibility table](http://kangax.github.io/compat-table/es2016plus/)
![async-await.jpg](https://qiita-image-store.s3.amazonaws.com/0/69667/bcbcac06-3f82-800a-2dd9-392279c26041.jpeg)

全てのブラウザで対応しているわけではないため、利用するなら Babel 等でトランスパイルする必要がある。

## `async`とは

非同期関数を定義する関数宣言のこと。
以下のように関数の前に`async`を宣言することにより、非同期関数（`async function`）を定義できる。

```javascript
async function sample() {}
```

### `async function`（`async`で宣言した関数）は何をするのか

- `async function`は呼び出されると`Promise`を返す。
- `async function`が値を`return`した場合、`Promise`は戻り値を`resolve`する。
- `async function`が例外や何らかの値を`throw`した場合はその値を`reject`する。

言葉だけだとわかりづらいため、利用例を見てみる。

## `async function`の利用例

以下は`async function`が`Promise`を返し、値を`resolve`、もしくは`reject`しているか確認するための利用例。
※このように利用することはほとんどないと思いますが、`async function`がどのような動きをしているのかを確認するために記載しております。

```javascript
// resolve1!!をreturnしているため、この値がresolveされる
async function resolveSample() {
  return 'resolve!!';
}

// resolveSampleがPromiseを返し、resolve!!がresolveされるため
// then()が実行されコンソールにresolve!!が表示される
resolveSample().then(value => {
  console.log(value); // => resolve!!
});

// reject!!をthrowしているため、この値がrejectされる
async function rejectSample() {
  throw new Error('reject!!');
}

// resolveSampleがPromiseを返し、reject!!がrejectされるため
// catch()が実行されコンソールにreject!!が表示される
rejectSample().catch(err => {
  console.log(err); // => reject!!
});

// resolveErrorはasync functionではないため、Promiseを返さない
function resolveError() {
  return 'resolveError!!';
}

// resolveErrorはPromiseを返さないため、エラーが発生して動かない
// Uncaught TypeError: resolveError(...).then is not a function
resolveError().then(value => {
  console.log(value);
});
```

上記の通り、`async function`が`Promise`を返し、値を`resolve`、もしくは`reject`していることがわかった。
上記は`async function`単体の利用例だが、`await`と併用して利用することが多く、「`async`を利用するなら`await`も必ず利用すべき」と書かれている記事もあった。

## `await`とは

`async function`内で`Promise`の結果（`resolve`、`reject`）が返されるまで待機する（処理を一時停止する）演算子のこと。
以下のように、関数の前に`await`を指定すると、その関数の`Promise`の結果が返されるまで待機する。

```javascript
async function sample() {
  const result = await sampleResolve();

  // sampleResolve()のPromiseの結果が返ってくるまで以下は実行されない
  console.log(result);
}
```

### `await`は何をするのか

- `await`を指定した関数の`Promise`の結果が返されるまで、`async function`内の処理を一時停止する。
- 結果が返されたら`async function`内の処理を再開する。

`await`は`async function`内でないと利用できないため、`async`/`await`の利用例を見ていく。

## `async`/`await`の利用例

以下は単純な`async`/`await`の利用例。

```javascript
function sampleResolve(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value * 2);
    }, 2000);
  });
}

/**
 * sampleResolve()をawaitしているため、Promiseの結果が返されるまで処理が一時停止される
 * 今回の場合、2秒後にresolve(10)が返ってきてその後の処理（return result + 5;）が再開される
 * resultにはresolveされた10が格納されているため、result + 5 = 15がreturnされる
 */
async function sample() {
  const result = await sampleResolve(5);
  return result + 5;
}

sample().then(result => {
  console.log(result); // => 15
});
```

上記の処理を`Promise`の構文で書くと以下のようになる。

```javascript
function sampleResolve(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value * 2);
    }, 2000);
  });
}

function sample() {
  return sampleResolve(5).then(result => {
    return result + 5;
  });
}

sample().then(result => {
  console.log(result); // => 15
});
```

2 つを見比べてみると、`async`/`await`の方が簡潔に書けることがわかる。
より複雑な処理の場合でも`async`/`await`を利用した方が簡潔に書けるため 、いくつか例を紹介していく。

### 連続した非同期処理

#### 連続した非同期処理（`Promise`構文）

```javascript
function sampleResolve(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, 1000);
  });
}

function sample() {
  let result = 0;

  return sampleResolve(5)
    .then(val => {
      result += val;
      return sampleResolve(10);
    })
    .then(val => {
      result *= val;
      return sampleResolve(20);
    })
    .then(val => {
      result += val;
      return result;
    });
}

sample().then(v => {
  console.log(v); // => 70
});
```

#### 連続した非同期処理（`async`/`await`構文）

`await`を利用すれば、`then()`で処理を繋げなくても連続した非同期処理が書ける。

```javascript
function sampleResolve(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, 1000);
  });
}

async function sample() {
  return (
    (await sampleResolve(5)) * (await sampleResolve(10)) +
    (await sampleResolve(20))
  );
}

async function sample2() {
  const a = await sampleResolve(5);
  const b = await sampleResolve(10);
  const c = await sampleResolve(20);
  return a * b + c;
}

sample().then(v => {
  console.log(v); // => 70
});

sample2().then(v => {
  console.log(v); // => 70
});
```

`for`を利用した繰り返しの非同期処理も書ける。

```javascript
function sampleResolve(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, 1000);
  });
}

async function sample() {
  for (let i = 0; i < 5; i += 1) {
    const result = await sampleResolve(i);
    console.log(result);
  }

  return 'ループ終わった。';
}

sample().then(v => {
  console.log(v); // => 0
  // => 1
  // => 2
  // => 3
  // => 4
  // => ループ終わった。
});
```

`array.reduce()`も利用できる。

```javascript
function sampleResolve(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, 1000);
  });
}

async function sample() {
  const array = [5, 10, 20];
  const sum = await array.reduce(async (sum, value) => {
    return (await sum) + (await sampleResolve(value)) * 2;
  }, 0);

  return sum;
}

sample().then(v => {
  console.log(v); // => 70
});
```

連続の非同期処理は、**処理を順番に行う必要がない限り利用すべきではない**ため注意。

例えば、画像を非同期読み込みをする場合、上記のような処理だと**1 つの画像を読み込みが完了するまで、次の画像の読み込みが始まらない**。

そのため、全ての画像の読み込みにかなりの時間がかかる。画像は連続して読み込む必要はないため、後述する並列の非同期処理で読み込むべき。

### 並列の非同期処理

#### 並列の非同期処理（`Promise`構文）

```javascript
function sampleResolve(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, 2000);
  });
}

function sampleResolve2(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value * 2);
    }, 1000);
  });
}

function sample() {
  const promiseA = sampleResolve(5);
  const promiseB = sampleResolve(10);
  const promiseC = promiseB.then(value => {
    return sampleResolve2(value);
  });

  return Promise.all([promiseA, promiseB, promiseC]).then(([a, b, c]) => {
    return [a, b, c];
  });
}

sample().then(([a, b, c]) => {
  console.log(a, b, c); // => 5 10 20
});
```

##### 並列の非同期処理（`async`/`await`構文）

`Promise.all`にも`await`を利用できるため、以下のように記述できる。

```javascript
function sampleResolve(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, 2000);
  });
}

function sampleResolve2(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value * 2);
    }, 1000);
  });
}

async function sample() {
  const [a, b] = await Promise.all([sampleResolve(5), sampleResolve(10)]);
  const c = await sampleResolve2(b);

  return [a, b, c];
}

sample().then(([a, b, c]) => {
  console.log(a, b, c); // => 5 10 20
});
```

`array.map()`も利用できる。

```javascript
function sampleResolve(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, 2000);
  });
}

async function sample() {
  const array = [5, 10, 15];
  const promiseAll = await Promise.all(
    array.map(async value => {
      return (await sampleResolve(value)) * 2;
    })
  );

  return promiseAll;
}

sample().then(([a, b, c]) => {
  console.log(a, b, c); // => 10 20 30
});
```

### 例外処理（エラーハンドリング）

#### 例外処理（エラーハンドリング）`Promise`構文）

```javascript
function throwError() {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      try {
        throw new Error('エラーあったよ');
        resolve('エラーなかった');
      } catch (err) {
        reject(err);
      }
    }, 1000);
  });
}

function errorHandling() {
  return throwError()
    .then(result => {
      return result;
    })
    .catch(err => {
      throw err;
    });
}

errorHandling().catch(err => {
  console.log(err); // => エラーあったよ
});
```

#### 例外処理（エラーハンドリング）`async`/`await`構文）

`await`を利用すれば、非同期処理の`try catch`を書ける。

```javascript
function throwError() {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      try {
        throw new Error('エラーあったよ');
        resolve('エラーなかった');
      } catch (err) {
        reject(err);
      }
    }, 1000);
  });
}

async function errorHandling() {
  try {
    const result = await throwError();
    return result;
  } catch (err) {
    throw err;
  }
}

errorHandling().catch(err => {
  console.log(err); // => エラーあったよ
});
```

実は`try catch`で囲まなくても上記のコードと同様に動く。

```javascript
function throwError() {
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      try {
        throw new Error('エラーあったよ');
        resolve('エラーなかった');
      } catch (err) {
        reject(err);
      }
    }, 1000);
  });
}

async function errorHandling() {
  // throwErrorがrejectを返したら処理が中断される
  const result = await throwError();
  return result;
}

errorHandling().catch(err => {
  console.log(err); // => エラーあったよ
});
```

## 終わり

フロントエンド実装で非同期処理は避けられないため、より簡潔に書ける`async`/`await`を覚えておいて損はないと思います。
とはいえ`async`/`await`も`Promise`を利用しているため、`Promise`自体の理解は必須です。
理解を深めるためにも以下の一読をオススメします。

- [JavaScript Promise の本](http://azu.github.io/promises-book/)
- [Promise と async-await の例外処理を完全に理解しよう](http://qiita.com/gaogao_9/items/40babdf63c73a491acbb)

また、連続した非同期処理（`for`文などの中で`await`）を利用するうえでの注意点に関しては、以下を一読すればさらに理解が深まるかと思います。

- [async/await 地獄](https://qiita.com/rana_kualu/items/e6c5c0e4f60b0d18799d)（単純に「使いどころを気をつけよう」という記事です。）
