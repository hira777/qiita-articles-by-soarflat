# Pug(Jade)記法で HTML のテンプレート的なの

Pug の勉強のために[HTML のテンプレート的なの](http://qiita.com/matsui-a/items/8d26f66ded3560d3d004)を Pug で書きました。

最終的なコードはこちら。

[soarflat-sandbox/pug-template](https://github.com/soarflat-sandbox/pug-template)

## Pug で書くとこうなる

元の HTML

```html
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="">
<meta name="keywords" content="">
<meta name="author" content="">
<meta property="og:title" content="タイトル">
<meta property="og:type" content="website">
<meta property="og:url" content="http://任意のURL">
<meta property="og:image" content="http://任意のURL/og_image.png">
<meta property="og:site_name" content="">
<meta property="og:description" content="" />
<meta property="fb:app_id" content="任意のID">
<title>タイトル</title>
<link rel="stylesheet" href="css/style.css">
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-XXXXXXXX-Y', 'example.com');
  ga('send', 'pageview');
</script>
</head>

<body>
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
<script> (window.jQuery || document .write('<script src="js/jquery-1.11.2.min.js"><\/script>')); </script>
<script src="js/scripts.js"></script>
</body>
</html>
```

これを Pug で書くと以下のようになる。

```pug
doctype
html(lang="ja")
  head
    meta(charset="utf-8")
    meta(http-equiv="X-UA-Compatible", content="IE=edge,chrome=1")
    meta(name="viewport", content="width=device-width, initial-scale=1")
    meta(name="description", content="")
    meta(name="keywords", content="")
    meta(name="author", content="")
    meta(property="og:title", content="タイトル")
    meta(property="og:type", content="website")
    meta(property="og:url", content="http://任意のURL")
    meta(property="og:image", content="http://任意のURL/og_image.png")
    meta(property="og:site_name", content="")
    meta(property="og:description", content="")
    meta(property="fb:app_id", content="任意のID")
    title タイトル
    link(rel='stylesheet', href="css/style.css")
    script.
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-XXXXXXXX-Y', 'example.com');
      ga('send', 'pageview');
  body
    script(src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js")
    script.
      (window.jQuery || document .write('<script src="js/jquery-1.11.2.min.js"><\/script>'));
    script(src="js/scripts.js")
```

比較してみると、ただ Pug 記法になっただけなので「Pug で書く必要なくない？」状態。

Pug らしい書き方になるようにする。

## Pug らしい書き方で書くとこうなる

**`index.pug`**

```pug
extends _layout
block var
  - metas = {}
  - metas.title = 'title'
  - metas.url = 'url'
  - metas.image = 'image'
  - metas.site_name = 'site_name'
  - metas.description = 'description'
block append meta
  +meta(metas)
  include _inc_meta_facebook
  +inc_meta_facebook(metas)
block title
  title
block body
```

**`_layout.pug`**

```pug
block var
doctype html
html(lang="ja")
  head
    meta(charset='utf-8')
    meta(http-equiv="X-UA-Compatible", content="IE=edge,chrome=1")
    meta(name="viewport", content="width=device-width, initial-scale=1")
    block meta
      mixin meta(metas)
        meta(name="description", content=metas.description)
        meta(name="keywords", content=metas.keywords)
        meta(name="author", content="")
    block title
    block link
      link(rel='stylesheet', href="css/style.css")
    block head_script
      script.
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-XXXXXXXX-Y', 'example.com');
        ga('send', 'pageview');
  body
    block body
    block end_of_body
      script(src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js")
      script.
        (window.jQuery || document .write('<script src="js/jquery-1.11.2.min.js"><\/script>'));
      script(src="js/scripts.js")
```

**`_inc_meta_facebook.pug`**

```pug
mixin inc_meta_facebook(metas)
  meta(property="og:title", content=metas.title)
  meta(property="og:type", content="website")
  meta(property="og:url", content="http://#{metas.url}")
  meta(property="og:image", content="http://#{metas.image}/og_image.png")
  meta(property="og:site_name", content=metas.site_name)
  meta(property="og:description", content=metas.description)
  meta(property="fb:app_id", content="任意のID")
```

ディレクトリ構成は以下を前提とする。

```lang:
.
├── index.pug
├── _layout.pug
└── _inc_meta_facebook.pug
```

Pug らしい書き方になった。

### コンパイルされる HTML

```html
<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="description">
        <meta name="keywords">
        <meta name="author" content="">
        <meta property="og:title" content="title">
        <meta property="og:type" content="website">
        <meta property="og:url" content="http://url">
        <meta property="og:image" content="http://image/og_image.png">
        <meta property="og:site_name" content="site_name">
        <meta property="og:description" content="description">
        <meta property="fb:app_id" content="任意のID">
    <title></title>
    <link rel="stylesheet" href="css/style.css">
    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-XXXXXXXX-Y', 'example.com');
      ga('send', 'pageview');
    </script>
  </head>
  <body>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    <script>(window.jQuery || document .write('<script src="js/jquery-1.11.2.min.js"><\/script>'));</script>
    <script src="js/scripts.js"></script>
  </body>
</html>
```

mixin の箇所にインデントが発生していまうのが気になる。

## 今回利用した Pug の機能

- 変数
- include
- extends
- block
- mixin

### 変数

Pug では変数が利用できる。今回の例では変数`metas`が存在する。

```pug
extends _layout
block var
  //- 変数metas
  - metas = {}
  - metas.title = 'title'
  - metas.url = 'url'
  - metas.image = 'image'
  - metas.site_name = 'site_name'
  - metas.description = 'description'
block append meta
  +meta(metas)
  include _inc_meta_facebook
  +inc_meta_facebook(metas)
block title
  title
block body
```

### include

他の Pug ファイルを読み込む。

**`index.pug`**

```pug
extends _layout
block var
  - metas = {}
  - metas.title = 'title'
  - metas.url = 'url'
  - metas.image = 'image'
  - metas.site_name = 'site_name'
  - metas.description = 'description'
block append meta
  +meta(metas)
  //- _inc_meta_facebook.pugを読み込む。
  include _inc_meta_facebook
  +inc_meta_facebook(metas)
block title
  title
block body
```

今回の例では`include _inc_meta_facebook`と記述されているため、`_inc_meta_facebook.pug`が読み込まれる。

**`_inc_meta_facebook.pug`**

```pug
mixin inc_meta_facebook(metas)
  meta(property="og:title", content=metas.title)
  meta(property="og:type", content="website")
  meta(property="og:url", content="http://#{metas.url}")
  meta(property="og:image", content="http://#{metas.image}/og_image.png")
  meta(property="og:site_name", content=metas.site_name)
  meta(property="og:description", content=metas.description)
  meta(property="fb:app_id", content="任意のID")
```

### extends と block

他の Pug ファイルを継承する。

**`index.pug`**

```pug
//- _layout.pugを敬承する。
extends _layout
block var
  - metas = {}
  - metas.title = 'title'
  - metas.url = 'url'
  - metas.image = 'image'
  - metas.site_name = 'site_name'
  - metas.description = 'description'
block append meta
  +meta(metas)
  include _inc_meta_facebook
  +inc_meta_facebook(metas)
block title
  title
block body
```

今回の例では`extends _layout`と記述されているため、`index.pug`に`_layout.pug`が継承される。

**`_layout.pug`**

```pug
block var
doctype html
html(lang="ja")
  head
    meta(charset='utf-8')
    meta(http-equiv="X-UA-Compatible", content="IE=edge,chrome=1")
    meta(name="viewport", content="width=device-width, initial-scale=1")
    block meta
      mixin meta(metas)
        meta(name="description", content=metas.description)
        meta(name="keywords", content=metas.keywords)
        meta(name="author", content="")
    block title
    block link
      link(rel='stylesheet', href="css/style.css")
    block head_script
      script.
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-XXXXXXXX-Y', 'example.com');
        ga('send', 'pageview');
  body
    block body
    block end_of_body
      script(src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js")
      script.
        (window.jQuery || document .write('<script src="js/jquery-1.11.2.min.js"><\/script>'));
      script(src="js/scripts.js")
```

`include`のように他の Pug ファイルを読み込むが、`include`とは異なり、継承先ファイルと継承元ファイルの同じ名前の`block`が紐づく(関連付く)。

#### 継承先と継承元の block の関係

敬承先に敬承元と同じ名前の`block`が存在しない場合、敬承元の`block`内の記述が読み込まれるが、敬承先にも同じ名前の`block`が存在する場合、`block`内の記述が上書きされる。

今回の例だと上書きされるのは`block var`、`block title`、`block body`内の記述。

**`index.pug`(敬承先)**

```pug
extends _layout
//- block varを上書きする。
block var
  - metas = {}
  - metas.title = 'title'
  - metas.url = 'url'
  - metas.image = 'image'
  - metas.site_name = 'site_name'
  - metas.description = 'description'
block append meta
  +meta(metas)
  include _inc_meta_facebook
  +inc_meta_facebook(metas)
//- block titleを上書きする。
block title
  title
//- block bodyを上書きする。
block body
```

**`_layout.pug`(敬承元)**

```pug
//- 敬承先にblock varが存在するため、敬承先に読み込まれない。
block var
doctype html
html(lang="ja")
  head
    meta(charset='utf-8')
    meta(http-equiv="X-UA-Compatible", content="IE=edge,chrome=1")
    meta(name="viewport", content="width=device-width, initial-scale=1")
    block meta
      mixin meta(metas)
        meta(name="description", content=metas.description)
        meta(name="keywords", content=metas.keywords)
        meta(name="author", content="")
    //- 敬承先にblock titleが存在するため、敬承先に読み込まれない。
    block title
    //- 敬承先にblock linkは存在しないため、敬承先に読み込まれる。
    block link
      link(rel='stylesheet', href="css/style.css")
    //- 敬承先にblock head_scriptは存在しないため、敬承先に読み込まれる。
    block head_script
      script.
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-XXXXXXXX-Y', 'example.com');
        ga('send', 'pageview');
  body
    //- 敬承先にblock bodyが存在するため、敬承先に読み込まれない。
    block body
    //- 敬承先にblock end_of_bodyは存在しないため、敬承先に読み込まれる。
    block end_of_body
      script(src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js")
      script.
        (window.jQuery || document .write('<script src="js/jquery-1.11.2.min.js"><\/script>'));
      script(src="js/scripts.js")
```

敬承先に敬承元と同じ名前の`block`が存在する場合、敬承先の`block`内に記述自体がなくても、敬承元の`block`内の記述は読みこまれないので注意。

#### block append

`block`と異なり、記述を上書きをするのではなく、敬承元の記述の後に敬承先の記述を追加できる。

**(敬承先)**

```pug
extends _layout
block var
  - metas = {}
  - metas.title = 'title'
  - metas.url = 'url'
  - metas.image = 'image'
  - metas.site_name = 'site_name'
  - metas.description = 'description'
//- 敬承元のblock meta内の記述の後にblock append meta内の記述が追加される。
block append meta
  +meta(metas)
  include _inc_meta_facebook
  +inc_meta_facebook(metas)
block title
  title
block body
```

**`_layout.pug`(敬承元)**

```pug
block var
doctype html
html(lang="ja")
  head
    meta(charset='utf-8')
    meta(http-equiv="X-UA-Compatible", content="IE=edge,chrome=1")
    meta(name="viewport", content="width=device-width, initial-scale=1")
    //- 敬承先にblock append metaが存在するため、敬承先に読み込まれる。
    block meta
      mixin meta(metas)
        meta(name="description", content=metas.description)
        meta(name="keywords", content=metas.keywords)
        meta(name="author", content="")
    block title
    block link
      link(rel='stylesheet', href="css/style.css")
    block head_script
      script.
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-XXXXXXXX-Y', 'example.com');
        ga('send', 'pageview');
  body
    block body
    block end_of_body
      script(src="//ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js")
      script.
        (window.jQuery || document .write('<script src="js/jquery-1.11.2.min.js"><\/script>'));
      script(src="js/scripts.js")
```

イメージとしては以下のように、敬承元の記述の後に敬承先の記述が追加される。

```pug
mixin meta(metas)
  meta(name="description", content=metas.description)
  meta(name="keywords", content=metas.keywords)
  meta(name="author", content="")
+meta(metas)
include _inc_meta_facebook
+inc_meta_facebook(metas)
```

#### block prepend

敬承元の記述の前に敬承先の記述を追加できる。

`block append meta`を`block prepend meta`にすると、イメージとしては以下のように、敬承元の記述の前に敬承先の記述が追加される。

```pug
+meta(metas)
include _inc_meta_facebook
+inc_meta_facebook(metas)
mixin meta(metas)
  meta(name="description", content=metas.description)
  meta(name="keywords", content=metas.keywords)
  meta(name="author", content="")
```

### mixin

関数のような再利用できる`block`を生成できる。

今回の例では`_layout.pug`に`mixin meta(metas)`が存在し、

```pug
mixin meta(metas)
  meta(name="description", content=metas.description)
  meta(name="keywords", content=metas.keywords)
  meta(name="author", content="")
```

`_inc_meta_facebook.pug`に`mixin inc_meta_facebook(metas)`が存在する。

```pug
mixin inc_meta_facebook(metas)
  meta(property="og:title", content=metas.title)
  meta(property="og:type", content="website")
  meta(property="og:url", content="http://#{metas.url}")
  meta(property="og:image", content="http://#{metas.image}/og_image.png")
  meta(property="og:site_name", content=metas.site_name)
  meta(property="og:description", content=metas.description)
  meta(property="fb:app_id", content="任意のID")
```

mixin を利用する時は、`+`を記述する。

今回の例では`block append meta`内で`mixin meta(metas)`と`mixn inc_meta_facebook(metas)`内の記述が追加される。

```pug
extends _layout
block var
  - metas = {}
  - metas.title = 'title'
  - metas.url = 'url'
  - metas.image = 'image'
  - metas.site_name = 'site_name'
  - metas.description = 'description'
block append meta
  //- block var内の変数metasが引数として渡され、
  //- mixin meta(metas)内の記述が追加される。
  +meta(metas)
  include _inc_meta_facebook
  //- block var内の変数metasが引数として渡され、
  //- mixn inc_meta_facebook(metas)内の記述が追加される。
  +inc_meta_facebook(metas)
block title
  title
block body
```

## 参考

- [軽量なマークアップ言語 Jade 入門 からの Gulp でコンパイルまで – Gulp で作る Web フロントエンド開発環境 #5](http://tech.recruit-mp.co.jp/front-end/post-2581/)
- [Jade の記法について](http://qiita.com/sasaplus1/items/189560f80cf337d40fdf)
