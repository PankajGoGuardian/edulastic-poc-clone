echo "====== $1 ======"
git log -1 $1  -- $3 | grep Author

echo "====== $2 ======"
git log -1 $2  -- $3 | grep Author
