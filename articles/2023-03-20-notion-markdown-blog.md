---
title: NotionをヘッドレスCMSにしてSSGでブログを作る
---

数年に一度訪れるブログ作ろうかな期がきたので、Notion をヘッドレス CMS として使って Notion API で Markdown ファイルを出力、それを Next.js で SSG して HTML を出力するブログを作った。

## 構成を考える

1. CMS には最近利用頻度の高い Notion を使いたい
1. データのポータビリティを考えて記事データは Markdown ファイルの形で置いておきたい
1. 凝ったことはしないので静的 HTML でサーバーにデプロイしたい

という要件をもとに、

- Notion API で取得した記事データを Markdown ファイルに書き出す
- その Markdown ファイルを Next.js で読み込んで SSG
- 吐き出された HTML ファイルを Firebase Hosting にデプロイ

という構成にした。

途中で一度 Markdown ファイルを経由しているのがこだわりかつ無駄なところで、単に Notion API + Next.js でブログを作るなら `getStaticPaths` と `getStaticProps` から直接 Notion API を呼び出して ISR なり SSG する方が簡単で手間も少ない。

ただその場合、将来 Notion 以外の環境でブログを書くとなった時に記事データの移行が面倒なので、プロ三日坊主である自分はあらかじめ移行しやすい形式に変換しておくことにした。

## GitHub Actions で更新を自動化する

Notion 上の記事データ取得からデプロイまで、記事を書く以外のすべての工程を GitHub Actions で自動化したが、Notion からデータを取得して Markdown ファイルにする部分については、こちらもブログ本体への依存を少なくするためにカスタムアクションとして別リポジトリに分けた。

[https://github.com/taqun/notion-to-markdown](https://github.com/taqun/notion-to-markdown)

これをブログ側のリポジトリ内のワークフローから呼び出し

- Notion API からデータを取得して Markdown ファイルを出力（現状は1日1回）
- Markdown ファイルに差分がない場合は終了、差分がある場合は自動で push
- push をトリガーに Next.js のビルドを走らせて Firebase Hosting にデプロイ

という流れでこのブログに反映される。

