cd app
npm run build
cd ..
rm -rf ./static
cp -r ./app/dist ./static
