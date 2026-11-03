#!/usr/bin/env bash
set -e
# The health plugin needs minSdk 26 or higher.
sed -i -E 's/minSdkVersion *= *[0-9]+/minSdkVersion = 26/' android/variables.gradle
grep -n "minSdkVersion" android/variables.gradle
