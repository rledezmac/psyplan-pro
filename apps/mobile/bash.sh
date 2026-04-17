npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android
npx cap init "PsyPlan" com.psyplan.app
npx cap add android
npx cap add ios
# Sync y build
npx cap sync
npx cap open android