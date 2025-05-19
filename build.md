## mac:

sudo pake ./index.html  --name UniSE --icon ./UniSE.icns --width 850 --height 480 --use-local-file --hide-title-bar --multi-arch

对于 M1 芯片用户，需要安装 x86 跨平台包，以使安装包支持 Intel 芯片。使用以下命令安装：

rustup target add x86_64-apple-darwin

对于 Intel 芯片用户，需要安装 arm64 跨平台包，以使安装包支持 M1 芯片。使用以下命令安装：

rustup target add aarch64-apple-darwin

## win：

pake ./index.html  --name UniSE --icon ./UniSE.ico --width 850 --height 480 --use-local-file --hide-title-bar

## linux:

sudo pake ./index.html  --name UniSE --icon ./UniSE.png --width 850 --height 480 --targets all --use-local-file --hide-title-bar