rm -rf ./dist

npm run build

cd ../kharjf/kharj/

nvm use 24

npm run build

cd -

mkdir ./dist/public

mkdir ./dist/public/front

mv -v ../kharjf/kharj/dist ./dist/public/front

npm run start:prod
