#!/bin/bash
# Parses manifest.json

## Valid JSON
if ! jq empty /tmp/manifest.json
then 
    echo "Invalid JSON. Exiting..."
    exit 1
fi

NOW=$(date +%Y%m%d)
INPUT=/var/srv/store-manifests/wordpress.json
SQLTMP=/tmp/update.sql
OUTPUT=/var/log/store-dl-upgrades/wordpress.log # use /var/log and logrotate!
ITEMS=($(jq -c '.items[]' /tmp/manifest.json))

# Check if pkg version has changed
for i in ${!ITEMS[@]}
do
    STORENAME=$(jq ".items[$i].storename" /tmp/manifest.json)
    VERSION=$(jq ".items[$i].version" /tmp/manifest.json)

    if [ -z $(jq ".items[] | select(.storename == $STORENAME) | .storename" /var/srv/store-manifests/wordpress.json) ] || \
       [ ! -z $(jq ".items[] | select(.storename == $STORENAME) | select(.version!=$VERSION) | .version" /var/srv/store-manifests/wordpress.json) ]
    then
        UPDATE=true
    fi
done

if [ ! $UPDATE ]
then
    echo "No Update needed"
    exit 0
fi

# Copy manifest to store manifests directory
mkdir -p /var/srv/store-manifests && cp /tmp/manifest.json $INPUT
mkdir -p /var/log/store-dl-upgrades

# Get all storenames and use them as index loop by object
objects=$(jq -r '.[] | .[] | .storename' $INPUT)

for storetag in $objects ; do
    echo "Now processing $storetag..."
    object=$(jq -r '.items[] | select(.storename=="'$storetag'")' $INPUT)

    published=$(echo -n $object | jq -r '.published')

    if [[ $published == "false" ]]
    then
        echo "Skipping $storetag due to \"published == false\""
        continue
    fi

    url=$(echo -n $object | jq -r '.url' | sed 's/downloads.wiris.com/downloads.wiris.kitchen/')
    version=$(echo -n $object | jq -r '.version' | awk 'BEGIN {FS=OFS="."} {if (NF=="4") {NF--; print} else {print}}')

    echo "UPDATE downloads SET link='$url', timestamp=CURRENT_TIMESTAMP(), version='$version' WHERE name='$storetag';" >> $SQLTMP
done

echo "Importing resulting SQL $SQLTMP into DB..."
mysql store < $SQLTMP


echo -e "===== $(date -Iseconds) =====" >> $OUTPUT
cat $SQLTMP >> $OUTPUT

rm $SQLTMP
