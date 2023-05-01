---
title: Corne Cherry 2台目を作った
---

コロナも落ち着いてきたことでちょくちょく自宅以外で仕事するケースも増えてきた。リモートワーク期間中にすっかり Corne Cherry がないと駄目な体になってしまったので、出先で使う用にもう一台を組んだ。

![上が1台目（初代 Corne Cherry?）、下が2台目の Corne Cherry V3](/images/b56a0b85-8882-490f-82a1-bf2d785d4eee.jpg "上が1台目（初代 Corne Cherry?）、下が2台目の Corne Cherry V3")

## キースイッチ選び

![](/images/3f00612d-cf62-40b9-bc85-f821db29e1c7.jpg)

1台目はキースイッチにKailh BOX Black を使っていた。せっかくなので今回は色々スイッチを試してみようとキースイッチテスターを探してみたが、たくさん種類を試せるテスターがそもそも少なく、あっても在庫がないなど見つけるのに難航した。最終的に俺らの遊舎工房で下記のテスターと、セットに含まれてないスイッチを幾つか購入。

- [KEY SWITCH SELECTION - Regular](https://shop.yushakobo.jp/products/key-switch-selection-regular)
- [KEY SWITCH SELECTION - Premium](https://shop.yushakobo.jp/products/5408)

周囲に人のいる環境で使うことも考え、今回は静音タイプの Kailh Midnight Silent V2 Switch / Linear を採用した。

## キーマップ設定

1台目を作った時は qmk を自分でファームウェアをビルドする方式だったのが、最近は[VIA](https://www.caniusevia.com/)という便利なソフトウェアでUI上でキーマップを設定できるらしい。とても便利なのだが、自分の場合　RAISE / LOWER キーにタップで入力ソース切り替え、ホールドでレイヤー切り替えを設定していて（`LT(_RAISE, KC_CAPS)`）、デフォルト設定だとタップ / ホールドの判定の使用感が微妙だったので、結局 `config.h` の設定をいじって qmk のファームウェアをビルドした。

## qmkのバージョンアップに伴う修正

1台目を作った時から2年ぐらいが経ち qmk のバージョンアップに伴って、当時のソースだとビルド時にエラーが出るので下記を修正した。

### メディアコントロール関係の Keycode が変更されてた

[https://github.com/qmk/qmk_firmware/pull/14726](https://github.com/qmk/qmk_firmware/pull/14726)

### TAPPING_FORCE_FOLD が QUICK_TAP_TERM に変更された

[https://github.com/qmk/qmk_firmware/pull/17007](https://github.com/qmk/qmk_firmware/pull/17007)

