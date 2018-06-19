# PATH を通すために環境変数の設定を理解する (Mac OS X)

- [PATH を通すとは？ (Mac OS X)](http://qiita.com/soarflat/items/09be6ab9cd91d366bf71)

PATH を通すには特定のファイルに`export PATH=$PATH:追加したいコマンド検索パス`のような記述を追加するみたいですが、記述内容が理解できず「export って何？何故$PATH を記述しているの？」状態だったのでそれに関しての備忘録です。

## PATH の通し方

`~/.bashrc`や`~/.bash_profile`に以下のコマンドを記述する。(記述はどちらかで良い。)

```bash
export PATH=$PATH:追加したいコマンド検索パス
```

```bash
export PATH=$PATH:追加したいコマンド検索パス
```

記述後は編集したファイルに対して`source`コマンドを実行しないと PATH が通らない。

```bash
source ~/.bashrc
source ~/.bash_profile
```

## export コマンドとは？

以下のことができるコマンド

- 環境変数を**表示**する。
- 環境変数を**設定**する。

### 環境変数を表示する

設定されている環境変数を表示する。

```bash
export -p

#出力結果(一部のみ記載)
declare -x PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
declare -x LANG="ja_JP.UTF-8"
declare -x SHELL="/bin/bash"
```

### 環境変数を設定する

たとえば`$ULB`という環境変数を設定したい場合、以下のように入力をする。

```bash
export ULB=/usr/local/bin
```

結果は表示されないが、環境変数`$ULB`が設定されたので`echo $ULB`で確認できる。

```bash
echo $ULB
/usr/local/bin #出力結果
```

設定した環境変数を利用してみる。

```bash
#どちらのコマンドでも同じ結果が出力される。
ls /usr/local/bin
ls $ULB
```

### 既に存在する環境変数を設定するとどうなるのか？

上書きされる。(再設定される。)

```bash
echo $ULB
/usr/local/bin #出力結果

export ULB=/u/l/b

echo $ULB
/u/l/b #出力結果
```

## 環境変数を削除したい

`unset`コマンドで環境変数を削除できる。先ほど設定した$ULB を削除したい場合、以下のように入力する。

```bash
unset ULB #[$]は入力しなくて良い。

echo $ULB
#何も出力されない。
```

## export を理解した上で再度 PATH を通す記述を確認してみる

環境変数`$PATH`を上書き(再設定)している記述だった。

```bash
export PATH=$PATH:追加したいコマンド検索パス
```

`$PATH`を記述しなくても以下のように記述すれば同じ。

```bash
#現在$PATHに設定されているコマンド検索パスが以下の場合
#/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/sbin
#どちらの記述でも$PATHに設定されるコマンド検索パスは同じ。
export PATH=$PATH:追加したいコマンド検索パス
export PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/sbin:追加したいコマンド検索パス
```

## 追加するコマンド検索パスの優先順位を高くしたい

コマンド検索パスには優先度があり、`echo $PATH`で出力された左から優先されるため、追加するコマンド検索パスの優先度を高くしたい場合、以下のように記述する。

```bash
export PATH=追加したいコマンド検索パス:$PATH
```

## そもそも.bash_profile、.bashrc とは？

- [.bash_profile ? .bashrc ? いろいろあるけどこいつらなにもの？](http://qiita.com/hirokishirai/items/5a529c8395c4b336bf31)
- [本当に正しい .bashrc と .bash_profile の使ひ分け](http://qiita.com/magicant/items/d3bb7ea1192e63fba850)
- [.bash_profile と.bashrc について](http://qiita.com/shyamahira/items/260862743e4c9794b5d2)
