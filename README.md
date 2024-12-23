# Catatan kebutuhan

**JDK:** 17 atau diatasnya

**Gradle:** 8.11.1


## Run Locally

Clone the project

```bash
  git clone https://github.com/afrinaldi-knitto/snow-react-native.git
```

Go to the project directory

```bash
  cd snow-react-native
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npx react-native run-android
```

**Note**

Jalankan emulator sebelum "start the server"


## Generate APK debug

Buat file dengan nama `index.android.bundle` di dalam path `android/app/src/main/assets/` jika belum ada

Lalu jalankan prompt

```bash
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
```

```bash
cd android && gradlew assembleDebug
```

