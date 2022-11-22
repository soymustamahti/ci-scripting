git fetch origin
git checkout dev
git revert --no-edit $1..$2
git push
bash src/script/rebase.sh $3