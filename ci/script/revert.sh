git fetch origin
git checkout dev
git pull
git revert --no-edit $1..$2
git push
git checkout $3
bash src/script/rebase.sh $3