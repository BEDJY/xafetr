const fs = require('fs');
const path = require('path');

// 1. Modificar gradle de nivel raíz para asegurar target 34
if (fs.existsSync('android/build.gradle')) {
  let rootGradle = fs.readFileSync('android/build.gradle', 'utf8');
  rootGradle = rootGradle.replace(/compileSdkVersion\s*=\s*\d+/g, 'compileSdkVersion = 34');
  rootGradle = rootGradle.replace(/targetSdkVersion\s*=\s*\d+/g, 'targetSdkVersion = 34');
  fs.writeFileSync('android/build.gradle', rootGradle);
}

// 2. Modificar gradle de app (Code Shrinking + Debug Signing for Release builds)
if (fs.existsSync('android/app/build.gradle')) {
  let appGradle = fs.readFileSync('android/app/build.gradle', 'utf8');
  appGradle = appGradle.replace(/minifyEnabled\s+false/g, 'minifyEnabled true');
  if (!appGradle.includes('shrinkResources')) {
    appGradle = appGradle.replace(/minifyEnabled\s+true/g, 'minifyEnabled true\n            shrinkResources true');
  }
  appGradle = appGradle.replace(/enableProguardInReleaseBuilds\s*=\s*false/g, 'enableProguardInReleaseBuilds = true');
  
  // Forzar firma debug en compilaciones de tipo Release para que sean instalables sin firmar
  if (appGradle.includes('signingConfig signingConfigs.debug') && !appGradle.includes('release {\n            signingConfig signingConfigs.debug')) {
    appGradle = appGradle.replace(/release\s*\{\s*/g, 'release {\n            signingConfig signingConfigs.debug\n            ');
  }
  
  fs.writeFileSync('android/app/build.gradle', appGradle);
}

// 3. Fusionar dependencias de package.json
const pkg = JSON.parse(fs.readFileSync('build-app/package.json', 'utf8'));
pkg.dependencies['react-native-svg'] = '^14.1.0';
pkg.dependencies['lucide-react-native'] = '^0.350.0';
pkg.dependencies['@gluestack-ui/themed'] = '^1.1.18';
pkg.dependencies['@gluestack-ui/config'] = '^1.1.18';
pkg.dependencies['@gluestack-style/react'] = '^1.0.57';
pkg.dependencies['react-native-safe-area-context'] = '^4.9.0';
pkg.dependencies['@expo/vector-icons'] = '^15.1.1';
pkg.dependencies['expo-font'] = '^12.0.0';
pkg.dependencies['zustand'] = '^5.0.14';
pkg.dependencies['@babel/plugin-transform-class-static-block'] = '^7.24.7';

const detectedDeps = new Set();
const scanDir = (dir) => {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    if (item === 'node_modules' || item === 'build-app' || item === 'android' || item.startsWith('.')) continue;
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (stat.isFile() && /\.(jsx?|tsx?)$/.test(item)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const importRegex = /(?:import\s+(?:[\w\s{},*]+)\s+from\s+['"]([^'"]+)['"])|(?:import\s+['"]([^'"]+)['"])|(?:require\s*\(\s*['"]([^'"]+)['"]\s*\))/g;
      let match;
      while ((match = importRegex.exec(content)) !== null) {
        const importPath = match[1] || match[2] || match[3];
        if (importPath) {
          let pkgName = importPath;
          if (importPath.startsWith('@')) {
            const parts = importPath.split('/');
            if (parts.length >= 2) pkgName = parts[0] + '/' + parts[1];
          } else {
            pkgName = importPath.split('/')[0];
          }
          if (!pkgName.startsWith('.') && !pkgName.startsWith('/') && 
              pkgName !== 'react-native' && pkgName !== 'react' && pkgName !== 'react-dom') {
            detectedDeps.add(pkgName);
          }
        }
      }
    }
  }
};

try {
  scanDir('.');
} catch(err) {
  console.error('Error durante escaneo:', err);
}

// Mappings de versiones conocidas para dependencias comunes
const defaultVersions = {
  'expo-status-bar': '^1.11.1',
  '@react-navigation/native': '^6.1.18',
  '@react-navigation/stack': '^6.4.1',
  '@react-navigation/bottom-tabs': '^6.6.1',
  'react-native-screens': '^3.35.0',
  'react-native-gesture-handler': '^2.21.2',
  'react-native-reanimated': '^3.6.2',
  'react-native-paper': '^5.12.3',
  'canvas-confetti': '^1.9.3'
};

for (const dep of detectedDeps) {
  if (!pkg.dependencies[dep]) {
    const version = defaultVersions[dep] || 'latest';
    pkg.dependencies[dep] = version;
    console.log('[Autodetect] Inyectando:', dep, '@', version);
  }
}

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
