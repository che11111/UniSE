## mac:

sudo pake ./index.html  --name UniSE --icon ./UniSE.icns --width 850 --height 480 --use-local-file --hide-title-bar 


“--multi-arch”

For users with M1 chips, you need to install the x86 cross-platform package to make the installation package compatible with Intel chips. Use the following command to install:

rustup target add x86_64-apple-darwin

For users with Intel chips, you need to install the arm64 cross-platform package to make the installation package compatible with M1 chips. Use the following command to install:

rustup target add aarch64-apple-darwin

## win：

pake ./index.html  --name UniSE --icon ./UniSE.ico --width 850 --height 480 --use-local-file --hide-title-bar

## linux:

sudo pake ./index.html  --name UniSE --icon ./UniSE.png --width 850 --height 480 --targets all --use-local-file --hide-title-bar

## docker

docker build -t unise-image .

docker run -d -p 5696:5696 --name unise-container unise

docker save -o unise-image.tar unise-image