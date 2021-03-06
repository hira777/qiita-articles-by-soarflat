# PATH を通すとは?

**コマンド検索パス（コマンドサーチパス）を追加すること**。

※色々な言葉で説明されていましたが、自分はこれが理解しやすかったです。

## コマンド検索パスとは?

シェルが**コマンド実行ファイルを探しに行くパス**のこと。

例えば、Mac の場合、`ls`というコマンドの実行ファイルは/bin ディレクトリに格納されている。そのため、`/bin/ls`と入力すると実行される。

しかし、**パスを指定せずに`ls`だけ入力しても`/bin/ls`と同じ実行がされる。**

```bash:コマンド
# どちらのコマンドでも同じ結果が出力される。
/bin/ls
ls
```

これは、コマンドがパスの指定なしで入力された時、シェルがそのコマンドに対応する実行ファイルを`/bin`や`/usr/bin`などのディレクトリへ探しに行き、同じ名前の実行ファイルがあれば、それを実行してくれるからである。

今回、`ls`を入力された時に探しに行った`/bin`ディレクトリに同じ名前の実行ファイルが存在したため、それが実行された。

このように、コマンド入力時にシェルが実行ファイルを探しに行くパスをコマンド検索パスと言う。

## コマンド検索パスの確認方法

コマンド検索パスは環境変数$PATH に設定されており、`echo $PATH`で確認できる。

自分の環境で`echo $PATH`を入力してみると、以下が出力される。

```bash:コマンド
echo $PATH
/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/sbin #実行結果
```

パスは`:`で区切られており、今回の例では下記のパスがコマンド検索パスとして設定されている。

```
/usr/local/bin
/usr/bin
/bin
/usr/sbin
/sbin
/usr/local/sbin
```

## コマンド実行ファイルの格納場所の確認方法

`which`を利用すれば指定したコマンドの実行ファイルがどこに格納されているのか確認できる。

`ls`コマンドの実行ファイルが`/bin`ディレクトリに格納されている場合、以下が出力される。

```bash:コマンド
which ls
/bin/ls #実行結果
```

## 同じ名前のコマンド実行ファイルが複数のコマンド検索パスに存在する場合

コマンド検索パスには優先度があり、`echo $PATH`で出力された左が優先される。

先ほどの例だと`/usr/local/bin`が一番優先される。

そのため、`/usr/local/bin/ls`と`/usr/bin/ls`のような同じ名前の実行ファイルが存在する場合、`/usr/local/bin/ls`が実行される。

コマンドは実行されるが、意図通りの実行がされない場合、パスの優先度が原因かもしれない。

## PATH を通す意味がわかったら

PATH を通しましたが、PATH を通すうえでよくわからないことがあったので投稿しました。

- [PATH を通すために環境変数の設定を理解する (Mac OS X)](http://qiita.com/soarflat/items/d5015bec37f8a8254380)
