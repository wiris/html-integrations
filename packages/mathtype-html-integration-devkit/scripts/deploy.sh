git clean -dfx;
npm install;
npm run build;
git config --global user.email "travis@travis-ci.org";
git config --global user.name "Travis CI";
git clone https://github.com/wiris/moodle-atto_wiris.git;
cd moodle-atto_wiris;
git checkout -B PLUGINS-1188
mv -f ../core.js .
if [[ `git status --porcelain` ]]
then
    # Changes in core.js
    sed -i "s/\$plugin->version = [[:digit:]]*/\$plugin->version = $(date +%Y%m%d00)/" version.php;
    sed -i "s/MATURITY_STABLE/MATURITY_BETA/" version.php;
    git add $(git diff --name-only);
    git commit -m "JS API $(date +%Y%m%d%H) development version";
    git push https://$GH_TOKEN@$GH_REPO $BRANCH > /dev/null 2>&1;
else
    echo "No changes. Skiping deploy in moodle-atto_wiris repository".
fi
