## 0.0.6 (2025-10-31)


### Bug Fixes

* **android-build:** update workflow to use keystore from GitHub secrets ([e8020bf](https://github.com/site15/my-dashboard/commit/e8020bfc0294c36297b0259b3d0227f4cb2fed8e))
* **android:** add skip android build flag check in release workflow [skip android] ([121c6d7](https://github.com/site15/my-dashboard/commit/121c6d7291beb9b91bb5872e005af7429fe9397f))
* **ci:** always enable Telegram notifications regardless of commit messages ([0f89c49](https://github.com/site15/my-dashboard/commit/0f89c49c43f2c160416f105b714a539c4a5afb6d))
* **ci:** correct APK copy command in release workflow [need ci] ([e4c8d7c](https://github.com/site15/my-dashboard/commit/e4c8d7c11813bb26310f38386a35290672cff558))
* **ci:** prevent duplicate git tags in release workflow [need ci] ([3ce893a](https://github.com/site15/my-dashboard/commit/3ce893a0867d960ebf45d4855e14c670ccf2b14b))
* **ci:** simplify and enhance release workflow [skip android] ([4134a93](https://github.com/site15/my-dashboard/commit/4134a937aea2ec33ef01a46b9a4286e80932366d))
* **ci:** simplify release workflow and improve artifact handling [skip android] ([a950c5a](https://github.com/site15/my-dashboard/commit/a950c5a8af869348125ca690e2749ff7506f302c))
* **ci:** update Node.js version and install commander globally ([cea5eed](https://github.com/site15/my-dashboard/commit/cea5eed14cd40c7f90cd61d9f8a4f4c1d4feae97))
* **ci:** update release workflow dependencies installation order [need ci] ([36ecdce](https://github.com/site15/my-dashboard/commit/36ecdce87a9a7346bfdf96a14486c7446748337c))
* **ci:** use sudo for apt-get install in release workflow [need ci] ([3aefd04](https://github.com/site15/my-dashboard/commit/3aefd0492aba5f3b57d3672ed7e829ff83cbdc89))
* **ionic_capacitor:** rename directory from ionic-capacitor to ionic_capacitor ([9220eae](https://github.com/site15/my-dashboard/commit/9220eaeac1506719171c5df8b1e05970c0e95ea3))
* **mobile:** move Docker container build docs to ionic_capacitor directory [need ci] ([504dc7a](https://github.com/site15/my-dashboard/commit/504dc7aa379584f397261860eae1934e18771b90))
* **mobile:** remove --no-prompt flag from Android build script ([f397858](https://github.com/site15/my-dashboard/commit/f397858c8b355853a89b67aec8b29006476e8d0a))
* **mobile:** replace npm build with ionic build for Android assets ([ec9101e](https://github.com/site15/my-dashboard/commit/ec9101e1d401f5c07fca5007919216c0022896a2))
* **mobile:** update capacitor config unconditionally in build script ([cb55877](https://github.com/site15/my-dashboard/commit/cb55877fb8777c78751546223b5c878341a3bd68))
* **mobile:** update Node.js version and correct build script path ([f0ab900](https://github.com/site15/my-dashboard/commit/f0ab900670dec39a5a3308646b1ffb40e7520c3c))
* **package:** remove author field from package.json files [need ci] ([872d378](https://github.com/site15/my-dashboard/commit/872d3786e6327d29f9677bd5e6ace2ecef527359))
* **package:** update metadata and clean release workflow script [skip android] ([3d3f4fa](https://github.com/site15/my-dashboard/commit/3d3f4fab5d15baff815a37114a7eae884eb952a6))
* **prisma:** replace unused process import with processLocal ([1df9182](https://github.com/site15/my-dashboard/commit/1df918271c3ffadcfdb5e69d5e3d50e32b51b80e))
* try add small changes ([2364509](https://github.com/site15/my-dashboard/commit/2364509f467c4d849d02868c79307f8e38a08e4e))
* **web:** add project description to package.json [skip android] ([fe9301d](https://github.com/site15/my-dashboard/commit/fe9301d89e40d619673713aa39f52ad1947b41cf))
* **workflow:** enhance release workflow with skip android and artifact improvements [skip android] ([e0d78eb](https://github.com/site15/my-dashboard/commit/e0d78eb5e888dc80ccb15906fbaccefb53228e7e))
* **workflows:** add manual trigger and improve telegram notification handling [skip android] ([0b61d1a](https://github.com/site15/my-dashboard/commit/0b61d1a9f8e55713be875a5294a01c87e640d4fa))
* **workflows:** ensure artifacts directory exists before copying APKs [need ci] ([8cc365d](https://github.com/site15/my-dashboard/commit/8cc365d772ea9a389807e61f15d8fce2427ff6b3))


### Features

* **android:** add GitHub Actions workflow for Android APK build ([b14e860](https://github.com/site15/my-dashboard/commit/b14e860c764db8a638009199f09393297c836d70))
* **auth:** add Telegram authentication with redirect method and server-side hash verification ([649e81f](https://github.com/site15/my-dashboard/commit/649e81ff604bdb1724a4096355703ea42f99ce3f))
* **build:** add vite-plugin-static-copy for Prisma .node assets ([a0db884](https://github.com/site15/my-dashboard/commit/a0db884d06f00484b3331f93ca05dd6399ac216c))
* **ci:** add auto version bump, build, release and Telegram notification workflow ([c49bcdc](https://github.com/site15/my-dashboard/commit/c49bcdc024c096a6ffa37d44bae46537f7eafcca))
* **prisma:** add PostgreSQL adapter and remove binary targets from generators ([f89e3c7](https://github.com/site15/my-dashboard/commit/f89e3c7b4ed4eb95b5ff399a3f5e33c923313041))
* **telegram:** add Telegram login widget component and integrate on welcome page ([d373ac3](https://github.com/site15/my-dashboard/commit/d373ac3e4e36a8053a1403d34e235ea3375f1eaa))
* **workflow-ci:** enhance release workflow with conditional runs and notifications [need ci] ([0ad072c](https://github.com/site15/my-dashboard/commit/0ad072ccbd1f285d750056f11dca7c1ba91a86c2))
* добавил мобилу ([017a46f](https://github.com/site15/my-dashboard/commit/017a46f6dd730356f436168d7386e3172ff1f07c))
* добавил сайт ([219913e](https://github.com/site15/my-dashboard/commit/219913e4f72c288821e846b06bd6ce589977f4de))



## 0.0.5 (2025-10-31)


### Bug Fixes

* **android-build:** update workflow to use keystore from GitHub secrets ([e8020bf](https://github.com/site15/my-dashboard/commit/e8020bfc0294c36297b0259b3d0227f4cb2fed8e))
* **android:** add skip android build flag check in release workflow [skip android] ([121c6d7](https://github.com/site15/my-dashboard/commit/121c6d7291beb9b91bb5872e005af7429fe9397f))
* **ci:** correct APK copy command in release workflow [need ci] ([e4c8d7c](https://github.com/site15/my-dashboard/commit/e4c8d7c11813bb26310f38386a35290672cff558))
* **ci:** prevent duplicate git tags in release workflow [need ci] ([3ce893a](https://github.com/site15/my-dashboard/commit/3ce893a0867d960ebf45d4855e14c670ccf2b14b))
* **ci:** simplify and enhance release workflow [skip android] ([4134a93](https://github.com/site15/my-dashboard/commit/4134a937aea2ec33ef01a46b9a4286e80932366d))
* **ci:** simplify release workflow and improve artifact handling [skip android] ([a950c5a](https://github.com/site15/my-dashboard/commit/a950c5a8af869348125ca690e2749ff7506f302c))
* **ci:** update Node.js version and install commander globally ([cea5eed](https://github.com/site15/my-dashboard/commit/cea5eed14cd40c7f90cd61d9f8a4f4c1d4feae97))
* **ci:** update release workflow dependencies installation order [need ci] ([36ecdce](https://github.com/site15/my-dashboard/commit/36ecdce87a9a7346bfdf96a14486c7446748337c))
* **ci:** use sudo for apt-get install in release workflow [need ci] ([3aefd04](https://github.com/site15/my-dashboard/commit/3aefd0492aba5f3b57d3672ed7e829ff83cbdc89))
* **ionic_capacitor:** rename directory from ionic-capacitor to ionic_capacitor ([9220eae](https://github.com/site15/my-dashboard/commit/9220eaeac1506719171c5df8b1e05970c0e95ea3))
* **mobile:** move Docker container build docs to ionic_capacitor directory [need ci] ([504dc7a](https://github.com/site15/my-dashboard/commit/504dc7aa379584f397261860eae1934e18771b90))
* **mobile:** remove --no-prompt flag from Android build script ([f397858](https://github.com/site15/my-dashboard/commit/f397858c8b355853a89b67aec8b29006476e8d0a))
* **mobile:** replace npm build with ionic build for Android assets ([ec9101e](https://github.com/site15/my-dashboard/commit/ec9101e1d401f5c07fca5007919216c0022896a2))
* **mobile:** update capacitor config unconditionally in build script ([cb55877](https://github.com/site15/my-dashboard/commit/cb55877fb8777c78751546223b5c878341a3bd68))
* **mobile:** update Node.js version and correct build script path ([f0ab900](https://github.com/site15/my-dashboard/commit/f0ab900670dec39a5a3308646b1ffb40e7520c3c))
* **package:** remove author field from package.json files [need ci] ([872d378](https://github.com/site15/my-dashboard/commit/872d3786e6327d29f9677bd5e6ace2ecef527359))
* **package:** update metadata and clean release workflow script [skip android] ([3d3f4fa](https://github.com/site15/my-dashboard/commit/3d3f4fab5d15baff815a37114a7eae884eb952a6))
* **prisma:** replace unused process import with processLocal ([1df9182](https://github.com/site15/my-dashboard/commit/1df918271c3ffadcfdb5e69d5e3d50e32b51b80e))
* try add small changes ([2364509](https://github.com/site15/my-dashboard/commit/2364509f467c4d849d02868c79307f8e38a08e4e))
* **web:** add project description to package.json [skip android] ([fe9301d](https://github.com/site15/my-dashboard/commit/fe9301d89e40d619673713aa39f52ad1947b41cf))
* **workflow:** enhance release workflow with skip android and artifact improvements [skip android] ([e0d78eb](https://github.com/site15/my-dashboard/commit/e0d78eb5e888dc80ccb15906fbaccefb53228e7e))
* **workflows:** add manual trigger and improve telegram notification handling [skip android] ([0b61d1a](https://github.com/site15/my-dashboard/commit/0b61d1a9f8e55713be875a5294a01c87e640d4fa))
* **workflows:** ensure artifacts directory exists before copying APKs [need ci] ([8cc365d](https://github.com/site15/my-dashboard/commit/8cc365d772ea9a389807e61f15d8fce2427ff6b3))


### Features

* **android:** add GitHub Actions workflow for Android APK build ([b14e860](https://github.com/site15/my-dashboard/commit/b14e860c764db8a638009199f09393297c836d70))
* **auth:** add Telegram authentication with redirect method and server-side hash verification ([649e81f](https://github.com/site15/my-dashboard/commit/649e81ff604bdb1724a4096355703ea42f99ce3f))
* **build:** add vite-plugin-static-copy for Prisma .node assets ([a0db884](https://github.com/site15/my-dashboard/commit/a0db884d06f00484b3331f93ca05dd6399ac216c))
* **ci:** add auto version bump, build, release and Telegram notification workflow ([c49bcdc](https://github.com/site15/my-dashboard/commit/c49bcdc024c096a6ffa37d44bae46537f7eafcca))
* **prisma:** add PostgreSQL adapter and remove binary targets from generators ([f89e3c7](https://github.com/site15/my-dashboard/commit/f89e3c7b4ed4eb95b5ff399a3f5e33c923313041))
* **telegram:** add Telegram login widget component and integrate on welcome page ([d373ac3](https://github.com/site15/my-dashboard/commit/d373ac3e4e36a8053a1403d34e235ea3375f1eaa))
* **workflow-ci:** enhance release workflow with conditional runs and notifications [need ci] ([0ad072c](https://github.com/site15/my-dashboard/commit/0ad072ccbd1f285d750056f11dca7c1ba91a86c2))
* добавил мобилу ([017a46f](https://github.com/site15/my-dashboard/commit/017a46f6dd730356f436168d7386e3172ff1f07c))
* добавил сайт ([219913e](https://github.com/site15/my-dashboard/commit/219913e4f72c288821e846b06bd6ce589977f4de))



## 0.0.4 (2025-10-31)


### Bug Fixes

* **android-build:** update workflow to use keystore from GitHub secrets ([e8020bf](https://github.com/site15/my-dashboard/commit/e8020bfc0294c36297b0259b3d0227f4cb2fed8e))
* **android:** add skip android build flag check in release workflow [skip android] ([121c6d7](https://github.com/site15/my-dashboard/commit/121c6d7291beb9b91bb5872e005af7429fe9397f))
* **ci:** correct APK copy command in release workflow [need ci] ([e4c8d7c](https://github.com/site15/my-dashboard/commit/e4c8d7c11813bb26310f38386a35290672cff558))
* **ci:** prevent duplicate git tags in release workflow [need ci] ([3ce893a](https://github.com/site15/my-dashboard/commit/3ce893a0867d960ebf45d4855e14c670ccf2b14b))
* **ci:** simplify release workflow and improve artifact handling [skip android] ([a950c5a](https://github.com/site15/my-dashboard/commit/a950c5a8af869348125ca690e2749ff7506f302c))
* **ci:** update Node.js version and install commander globally ([cea5eed](https://github.com/site15/my-dashboard/commit/cea5eed14cd40c7f90cd61d9f8a4f4c1d4feae97))
* **ci:** update release workflow dependencies installation order [need ci] ([36ecdce](https://github.com/site15/my-dashboard/commit/36ecdce87a9a7346bfdf96a14486c7446748337c))
* **ci:** use sudo for apt-get install in release workflow [need ci] ([3aefd04](https://github.com/site15/my-dashboard/commit/3aefd0492aba5f3b57d3672ed7e829ff83cbdc89))
* **ionic_capacitor:** rename directory from ionic-capacitor to ionic_capacitor ([9220eae](https://github.com/site15/my-dashboard/commit/9220eaeac1506719171c5df8b1e05970c0e95ea3))
* **mobile:** move Docker container build docs to ionic_capacitor directory [need ci] ([504dc7a](https://github.com/site15/my-dashboard/commit/504dc7aa379584f397261860eae1934e18771b90))
* **mobile:** remove --no-prompt flag from Android build script ([f397858](https://github.com/site15/my-dashboard/commit/f397858c8b355853a89b67aec8b29006476e8d0a))
* **mobile:** replace npm build with ionic build for Android assets ([ec9101e](https://github.com/site15/my-dashboard/commit/ec9101e1d401f5c07fca5007919216c0022896a2))
* **mobile:** update capacitor config unconditionally in build script ([cb55877](https://github.com/site15/my-dashboard/commit/cb55877fb8777c78751546223b5c878341a3bd68))
* **mobile:** update Node.js version and correct build script path ([f0ab900](https://github.com/site15/my-dashboard/commit/f0ab900670dec39a5a3308646b1ffb40e7520c3c))
* **package:** remove author field from package.json files [need ci] ([872d378](https://github.com/site15/my-dashboard/commit/872d3786e6327d29f9677bd5e6ace2ecef527359))
* **package:** update metadata and clean release workflow script [skip android] ([3d3f4fa](https://github.com/site15/my-dashboard/commit/3d3f4fab5d15baff815a37114a7eae884eb952a6))
* **prisma:** replace unused process import with processLocal ([1df9182](https://github.com/site15/my-dashboard/commit/1df918271c3ffadcfdb5e69d5e3d50e32b51b80e))
* try add small changes ([2364509](https://github.com/site15/my-dashboard/commit/2364509f467c4d849d02868c79307f8e38a08e4e))
* **web:** add project description to package.json [skip android] ([fe9301d](https://github.com/site15/my-dashboard/commit/fe9301d89e40d619673713aa39f52ad1947b41cf))
* **workflow:** enhance release workflow with skip android and artifact improvements [skip android] ([e0d78eb](https://github.com/site15/my-dashboard/commit/e0d78eb5e888dc80ccb15906fbaccefb53228e7e))
* **workflows:** add manual trigger and improve telegram notification handling [skip android] ([0b61d1a](https://github.com/site15/my-dashboard/commit/0b61d1a9f8e55713be875a5294a01c87e640d4fa))
* **workflows:** ensure artifacts directory exists before copying APKs [need ci] ([8cc365d](https://github.com/site15/my-dashboard/commit/8cc365d772ea9a389807e61f15d8fce2427ff6b3))


### Features

* **android:** add GitHub Actions workflow for Android APK build ([b14e860](https://github.com/site15/my-dashboard/commit/b14e860c764db8a638009199f09393297c836d70))
* **auth:** add Telegram authentication with redirect method and server-side hash verification ([649e81f](https://github.com/site15/my-dashboard/commit/649e81ff604bdb1724a4096355703ea42f99ce3f))
* **build:** add vite-plugin-static-copy for Prisma .node assets ([a0db884](https://github.com/site15/my-dashboard/commit/a0db884d06f00484b3331f93ca05dd6399ac216c))
* **ci:** add auto version bump, build, release and Telegram notification workflow ([c49bcdc](https://github.com/site15/my-dashboard/commit/c49bcdc024c096a6ffa37d44bae46537f7eafcca))
* **prisma:** add PostgreSQL adapter and remove binary targets from generators ([f89e3c7](https://github.com/site15/my-dashboard/commit/f89e3c7b4ed4eb95b5ff399a3f5e33c923313041))
* **telegram:** add Telegram login widget component and integrate on welcome page ([d373ac3](https://github.com/site15/my-dashboard/commit/d373ac3e4e36a8053a1403d34e235ea3375f1eaa))
* **workflow-ci:** enhance release workflow with conditional runs and notifications [need ci] ([0ad072c](https://github.com/site15/my-dashboard/commit/0ad072ccbd1f285d750056f11dca7c1ba91a86c2))
* добавил мобилу ([017a46f](https://github.com/site15/my-dashboard/commit/017a46f6dd730356f436168d7386e3172ff1f07c))
* добавил сайт ([219913e](https://github.com/site15/my-dashboard/commit/219913e4f72c288821e846b06bd6ce589977f4de))



## 0.0.3 (2025-10-31)


### Bug Fixes

* **android-build:** update workflow to use keystore from GitHub secrets ([e8020bf](https://github.com/site15/my-dashboard/commit/e8020bfc0294c36297b0259b3d0227f4cb2fed8e))
* **android:** add skip android build flag check in release workflow [skip android] ([121c6d7](https://github.com/site15/my-dashboard/commit/121c6d7291beb9b91bb5872e005af7429fe9397f))
* **ci:** correct APK copy command in release workflow [need ci] ([e4c8d7c](https://github.com/site15/my-dashboard/commit/e4c8d7c11813bb26310f38386a35290672cff558))
* **ci:** prevent duplicate git tags in release workflow [need ci] ([3ce893a](https://github.com/site15/my-dashboard/commit/3ce893a0867d960ebf45d4855e14c670ccf2b14b))
* **ci:** update Node.js version and install commander globally ([cea5eed](https://github.com/site15/my-dashboard/commit/cea5eed14cd40c7f90cd61d9f8a4f4c1d4feae97))
* **ci:** update release workflow dependencies installation order [need ci] ([36ecdce](https://github.com/site15/my-dashboard/commit/36ecdce87a9a7346bfdf96a14486c7446748337c))
* **ci:** use sudo for apt-get install in release workflow [need ci] ([3aefd04](https://github.com/site15/my-dashboard/commit/3aefd0492aba5f3b57d3672ed7e829ff83cbdc89))
* **ionic_capacitor:** rename directory from ionic-capacitor to ionic_capacitor ([9220eae](https://github.com/site15/my-dashboard/commit/9220eaeac1506719171c5df8b1e05970c0e95ea3))
* **mobile:** move Docker container build docs to ionic_capacitor directory [need ci] ([504dc7a](https://github.com/site15/my-dashboard/commit/504dc7aa379584f397261860eae1934e18771b90))
* **mobile:** remove --no-prompt flag from Android build script ([f397858](https://github.com/site15/my-dashboard/commit/f397858c8b355853a89b67aec8b29006476e8d0a))
* **mobile:** replace npm build with ionic build for Android assets ([ec9101e](https://github.com/site15/my-dashboard/commit/ec9101e1d401f5c07fca5007919216c0022896a2))
* **mobile:** update capacitor config unconditionally in build script ([cb55877](https://github.com/site15/my-dashboard/commit/cb55877fb8777c78751546223b5c878341a3bd68))
* **mobile:** update Node.js version and correct build script path ([f0ab900](https://github.com/site15/my-dashboard/commit/f0ab900670dec39a5a3308646b1ffb40e7520c3c))
* **package:** remove author field from package.json files [need ci] ([872d378](https://github.com/site15/my-dashboard/commit/872d3786e6327d29f9677bd5e6ace2ecef527359))
* **package:** update metadata and clean release workflow script [skip android] ([3d3f4fa](https://github.com/site15/my-dashboard/commit/3d3f4fab5d15baff815a37114a7eae884eb952a6))
* **prisma:** replace unused process import with processLocal ([1df9182](https://github.com/site15/my-dashboard/commit/1df918271c3ffadcfdb5e69d5e3d50e32b51b80e))
* try add small changes ([2364509](https://github.com/site15/my-dashboard/commit/2364509f467c4d849d02868c79307f8e38a08e4e))
* **web:** add project description to package.json [skip android] ([fe9301d](https://github.com/site15/my-dashboard/commit/fe9301d89e40d619673713aa39f52ad1947b41cf))
* **workflows:** ensure artifacts directory exists before copying APKs [need ci] ([8cc365d](https://github.com/site15/my-dashboard/commit/8cc365d772ea9a389807e61f15d8fce2427ff6b3))


### Features

* **android:** add GitHub Actions workflow for Android APK build ([b14e860](https://github.com/site15/my-dashboard/commit/b14e860c764db8a638009199f09393297c836d70))
* **auth:** add Telegram authentication with redirect method and server-side hash verification ([649e81f](https://github.com/site15/my-dashboard/commit/649e81ff604bdb1724a4096355703ea42f99ce3f))
* **build:** add vite-plugin-static-copy for Prisma .node assets ([a0db884](https://github.com/site15/my-dashboard/commit/a0db884d06f00484b3331f93ca05dd6399ac216c))
* **ci:** add auto version bump, build, release and Telegram notification workflow ([c49bcdc](https://github.com/site15/my-dashboard/commit/c49bcdc024c096a6ffa37d44bae46537f7eafcca))
* **prisma:** add PostgreSQL adapter and remove binary targets from generators ([f89e3c7](https://github.com/site15/my-dashboard/commit/f89e3c7b4ed4eb95b5ff399a3f5e33c923313041))
* **telegram:** add Telegram login widget component and integrate on welcome page ([d373ac3](https://github.com/site15/my-dashboard/commit/d373ac3e4e36a8053a1403d34e235ea3375f1eaa))
* **workflow-ci:** enhance release workflow with conditional runs and notifications [need ci] ([0ad072c](https://github.com/site15/my-dashboard/commit/0ad072ccbd1f285d750056f11dca7c1ba91a86c2))
* добавил мобилу ([017a46f](https://github.com/site15/my-dashboard/commit/017a46f6dd730356f436168d7386e3172ff1f07c))
* добавил сайт ([219913e](https://github.com/site15/my-dashboard/commit/219913e4f72c288821e846b06bd6ce589977f4de))



## 0.0.2 (2025-10-31)


### Bug Fixes

* **android-build:** update workflow to use keystore from GitHub secrets ([e8020bf](https://github.com/site15/my-dashboard/commit/e8020bfc0294c36297b0259b3d0227f4cb2fed8e))
* **android:** add skip android build flag check in release workflow [skip android] ([121c6d7](https://github.com/site15/my-dashboard/commit/121c6d7291beb9b91bb5872e005af7429fe9397f))
* **ci:** correct APK copy command in release workflow [need ci] ([e4c8d7c](https://github.com/site15/my-dashboard/commit/e4c8d7c11813bb26310f38386a35290672cff558))
* **ci:** update Node.js version and install commander globally ([cea5eed](https://github.com/site15/my-dashboard/commit/cea5eed14cd40c7f90cd61d9f8a4f4c1d4feae97))
* **ci:** update release workflow dependencies installation order [need ci] ([36ecdce](https://github.com/site15/my-dashboard/commit/36ecdce87a9a7346bfdf96a14486c7446748337c))
* **ci:** use sudo for apt-get install in release workflow [need ci] ([3aefd04](https://github.com/site15/my-dashboard/commit/3aefd0492aba5f3b57d3672ed7e829ff83cbdc89))
* **ionic_capacitor:** rename directory from ionic-capacitor to ionic_capacitor ([9220eae](https://github.com/site15/my-dashboard/commit/9220eaeac1506719171c5df8b1e05970c0e95ea3))
* **mobile:** remove --no-prompt flag from Android build script ([f397858](https://github.com/site15/my-dashboard/commit/f397858c8b355853a89b67aec8b29006476e8d0a))
* **mobile:** replace npm build with ionic build for Android assets ([ec9101e](https://github.com/site15/my-dashboard/commit/ec9101e1d401f5c07fca5007919216c0022896a2))
* **mobile:** update capacitor config unconditionally in build script ([cb55877](https://github.com/site15/my-dashboard/commit/cb55877fb8777c78751546223b5c878341a3bd68))
* **mobile:** update Node.js version and correct build script path ([f0ab900](https://github.com/site15/my-dashboard/commit/f0ab900670dec39a5a3308646b1ffb40e7520c3c))
* **prisma:** replace unused process import with processLocal ([1df9182](https://github.com/site15/my-dashboard/commit/1df918271c3ffadcfdb5e69d5e3d50e32b51b80e))
* try add small changes ([2364509](https://github.com/site15/my-dashboard/commit/2364509f467c4d849d02868c79307f8e38a08e4e))
* **web:** add project description to package.json [skip android] ([fe9301d](https://github.com/site15/my-dashboard/commit/fe9301d89e40d619673713aa39f52ad1947b41cf))
* **workflows:** ensure artifacts directory exists before copying APKs [need ci] ([8cc365d](https://github.com/site15/my-dashboard/commit/8cc365d772ea9a389807e61f15d8fce2427ff6b3))


### Features

* **android:** add GitHub Actions workflow for Android APK build ([b14e860](https://github.com/site15/my-dashboard/commit/b14e860c764db8a638009199f09393297c836d70))
* **auth:** add Telegram authentication with redirect method and server-side hash verification ([649e81f](https://github.com/site15/my-dashboard/commit/649e81ff604bdb1724a4096355703ea42f99ce3f))
* **build:** add vite-plugin-static-copy for Prisma .node assets ([a0db884](https://github.com/site15/my-dashboard/commit/a0db884d06f00484b3331f93ca05dd6399ac216c))
* **ci:** add auto version bump, build, release and Telegram notification workflow ([c49bcdc](https://github.com/site15/my-dashboard/commit/c49bcdc024c096a6ffa37d44bae46537f7eafcca))
* **prisma:** add PostgreSQL adapter and remove binary targets from generators ([f89e3c7](https://github.com/site15/my-dashboard/commit/f89e3c7b4ed4eb95b5ff399a3f5e33c923313041))
* **telegram:** add Telegram login widget component and integrate on welcome page ([d373ac3](https://github.com/site15/my-dashboard/commit/d373ac3e4e36a8053a1403d34e235ea3375f1eaa))
* **workflow-ci:** enhance release workflow with conditional runs and notifications [need ci] ([0ad072c](https://github.com/site15/my-dashboard/commit/0ad072ccbd1f285d750056f11dca7c1ba91a86c2))
* добавил мобилу ([017a46f](https://github.com/site15/my-dashboard/commit/017a46f6dd730356f436168d7386e3172ff1f07c))
* добавил сайт ([219913e](https://github.com/site15/my-dashboard/commit/219913e4f72c288821e846b06bd6ce589977f4de))



## 0.0.1 (2025-10-31)


### Bug Fixes

* **android-build:** update workflow to use keystore from GitHub secrets ([e8020bf](https://github.com/site15/my-dashboard/commit/e8020bfc0294c36297b0259b3d0227f4cb2fed8e))
* **ci:** correct APK copy command in release workflow [need ci] ([e4c8d7c](https://github.com/site15/my-dashboard/commit/e4c8d7c11813bb26310f38386a35290672cff558))
* **ci:** update Node.js version and install commander globally ([cea5eed](https://github.com/site15/my-dashboard/commit/cea5eed14cd40c7f90cd61d9f8a4f4c1d4feae97))
* **ci:** update release workflow dependencies installation order [need ci] ([36ecdce](https://github.com/site15/my-dashboard/commit/36ecdce87a9a7346bfdf96a14486c7446748337c))
* **ci:** use sudo for apt-get install in release workflow [need ci] ([3aefd04](https://github.com/site15/my-dashboard/commit/3aefd0492aba5f3b57d3672ed7e829ff83cbdc89))
* **ionic_capacitor:** rename directory from ionic-capacitor to ionic_capacitor ([9220eae](https://github.com/site15/my-dashboard/commit/9220eaeac1506719171c5df8b1e05970c0e95ea3))
* **mobile:** remove --no-prompt flag from Android build script ([f397858](https://github.com/site15/my-dashboard/commit/f397858c8b355853a89b67aec8b29006476e8d0a))
* **mobile:** replace npm build with ionic build for Android assets ([ec9101e](https://github.com/site15/my-dashboard/commit/ec9101e1d401f5c07fca5007919216c0022896a2))
* **mobile:** update capacitor config unconditionally in build script ([cb55877](https://github.com/site15/my-dashboard/commit/cb55877fb8777c78751546223b5c878341a3bd68))
* **mobile:** update Node.js version and correct build script path ([f0ab900](https://github.com/site15/my-dashboard/commit/f0ab900670dec39a5a3308646b1ffb40e7520c3c))
* **prisma:** replace unused process import with processLocal ([1df9182](https://github.com/site15/my-dashboard/commit/1df918271c3ffadcfdb5e69d5e3d50e32b51b80e))
* try add small changes ([2364509](https://github.com/site15/my-dashboard/commit/2364509f467c4d849d02868c79307f8e38a08e4e))
* **workflows:** ensure artifacts directory exists before copying APKs [need ci] ([8cc365d](https://github.com/site15/my-dashboard/commit/8cc365d772ea9a389807e61f15d8fce2427ff6b3))


### Features

* **android:** add GitHub Actions workflow for Android APK build ([b14e860](https://github.com/site15/my-dashboard/commit/b14e860c764db8a638009199f09393297c836d70))
* **auth:** add Telegram authentication with redirect method and server-side hash verification ([649e81f](https://github.com/site15/my-dashboard/commit/649e81ff604bdb1724a4096355703ea42f99ce3f))
* **build:** add vite-plugin-static-copy for Prisma .node assets ([a0db884](https://github.com/site15/my-dashboard/commit/a0db884d06f00484b3331f93ca05dd6399ac216c))
* **ci:** add auto version bump, build, release and Telegram notification workflow ([c49bcdc](https://github.com/site15/my-dashboard/commit/c49bcdc024c096a6ffa37d44bae46537f7eafcca))
* **prisma:** add PostgreSQL adapter and remove binary targets from generators ([f89e3c7](https://github.com/site15/my-dashboard/commit/f89e3c7b4ed4eb95b5ff399a3f5e33c923313041))
* **telegram:** add Telegram login widget component and integrate on welcome page ([d373ac3](https://github.com/site15/my-dashboard/commit/d373ac3e4e36a8053a1403d34e235ea3375f1eaa))
* **workflow-ci:** enhance release workflow with conditional runs and notifications [need ci] ([0ad072c](https://github.com/site15/my-dashboard/commit/0ad072ccbd1f285d750056f11dca7c1ba91a86c2))
* добавил мобилу ([017a46f](https://github.com/site15/my-dashboard/commit/017a46f6dd730356f436168d7386e3172ff1f07c))
* добавил сайт ([219913e](https://github.com/site15/my-dashboard/commit/219913e4f72c288821e846b06bd6ce589977f4de))



