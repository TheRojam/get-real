#DGB 2014-07-18 Small script to launch meteor making sure all developers run the same environment
# 1.3 2014-09-19 Added Update packages
# 1.2 2014-09-15 Fast update / Meteorite is now deprecated
# 1.1 2014-07-30 Updated so now we can fix a release for meteor AND meteorite

# Here you fix the version you want to use for meteor and meteorite, use the smart.json to fix packages versions
METEOR_VERSION="1.3"

#METEORITE_VERSION="0.7.4"
#meteoriteversion=`mrt --version | head -1 | cut -d" " -f3`;


#if [ "$meteoriteversion" == $METEORITE_VERSION ]
#then
#	echo -e "\n\nMeteorite at version $METEORITE_VERSION - GOOD"
	echo -e "\n\nForcing meteor version $METEOR_VERSION"
	meteor update --release $METEOR_VERSION
	#DGB 2014-10-01 commented out because this actually update packages ignoring the pinning on the .meteor/packages
	#echo -e "\n\nUpdating packages"
	#meteor update --packages-only
	echo -e "\n\nWe are going to launch with these packages"
	meteor list
#	echo -e "\n\nRemove unneded OFFICIAL packages"
#	meteor remove blaze-layout
#	echo -e "\n\nUpdating packages listed in smart.json that aren't already installed on your machine. smart.lock will be overwritten)"
#	mrt install;
#	mrt update;
	echo -e "\n\nLaunching meteor at port 8080 ... (cross fingers)"
	meteor --port 8080 --release $METEOR_VERSION --settings settings_production.json
#else
#	echo "Please update Meteorite to the $METEORITE_VERSION version: mrt -g install meteorite"
#fi;
