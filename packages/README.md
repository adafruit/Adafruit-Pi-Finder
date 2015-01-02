# Debian Packages

## Building

Use the following command to build packages:

```
dpkg-deb -b occidentalis build/occidentalis_0.3.1_armhf.deb
```

Replace `0.3.1` with the version you are building, and make sure your
build target is in the `build` folder.
