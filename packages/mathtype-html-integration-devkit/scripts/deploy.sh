npm install;
git config --global user.email "travis@travis-ci.org";
git config --global user.name "Travis CI";
git clone https://github.com/wiris/moodle-atto_wiris.git;
cd moodle-atto_wiris;
git checkout -B $BRANCH
mv -f ../${FILES} .
if [ -z "$(git status --porcelain)"];
then
# Changes in core.js
sed -i "s/\$plugin->version = [[:digit:]]*/\$plugin->version = $(date +%Y%m%d00)/" version.php;
sed -i "s/MATURITY_STABLE/MATURITY_BETA/" version.php;
git add $(git diff --name-only);
git commit -m "JS API $(date +%Y%m%d%H) development version";
echo "TRAVIS_BRANCH=$TRAVIS_BRANCH, PR=$PR, BRANCH=$BRANCH";
git push https://${GH_TOKEN}@${GH_REPO} $BRANCH > /dev/null 2>&1
else
# No changes in core.js
fi;


