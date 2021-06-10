echo "====== $1 ======"
git log -2 $1  -- $3 | grep -i -E "Author|Date"

echo "====== $2 ======"
git log -2 $2  -- $3 | grep -i -E  "Author|Date"
