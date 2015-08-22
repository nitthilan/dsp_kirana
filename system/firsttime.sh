#Installing git
sudo apt-get install -y git

# Installing nodejs
curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install -y nodejs
# Installing build tools
sudo apt-get install -y build-essential

# Installing grunt, bower and forever cli
sudo npm install -g grunt-cli
sudo npm install -g bower
sudo npm install -g forever

# Installing mongodb
# http://docs.mongodb.org/manual/tutorial/install-mongodb-on-ubuntu/
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get update
sudo apt-get install -y mongodb-org

#installing numpy and scipy http://askubuntu.com/questions/359254/how-to-install-numpy-and-scipy-for-python
sudo apt-get install python-numpy
sudo apt-get install python-scipy # ideally not reqquired
sudo apt-get install python-matplotlib # ideally not required
# Installing opencv
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install build-essential libgtk2.0-dev libjpeg-dev libtiff4-dev libjasper-dev libopenexr-dev cmake python-dev python-numpy python-tk libtbb-dev libeigen3-dev yasm libfaac-dev libopencore-amrnb-dev libopencore-amrwb-dev libtheora-dev libvorbis-dev libxvidcore-dev libx264-dev libqt4-dev libqt4-opengl-dev sphinx-common texlive-latex-extra libv4l-dev libdc1394-22-dev libavcodec-dev libavformat-dev libswscale-dev default-jdk ant libvtk5-qt4-dev
sudo apt-get install unzip
sudo apt-get install cmake
cd ~
mkdir opencv
cd opencv
wget https://github.com/Itseez/opencv/archive/3.0.0-beta.zip
unzip 3.0.0-beta.zip
cd opencv-3.0.0-beta
mkdir release
cd release
#cmake -D CMAKE_BUILD_TYPE=RELEASE -D CMAKE_INSTALL_PREFIX=/usr/local ..
cmake -D CMAKE_BUILD_TYPE=RELEASE -D CMAKE_INSTALL_PREFIX=/usr/local -D BUILD_NEW_PYTHON_SUPPORT=ON -D BUILD_EXAMPLES=ON ..
# # QT has been disabled since we are running in server
# cmake -D WITH_TBB=ON -D BUILD_NEW_PYTHON_SUPPORT=ON -D WITH_V4L=ON -D INSTALL_C_EXAMPLES=ON -D INSTALL_PYTHON_EXAMPLES=ON -D BUILD_EXAMPLES=ON -D WITH_QT=OFF -D WITH_OPENGL=ON -D WITH_VTK=ON ..
sudo make
sudo make install

# Starting mongo
sudo service mongod start
cat /var/log/mongodb/mongod.log


# Getting and building workspace
cd ~
mkdir workspace
cd workspace
git clone https://bitbucket.org/nitthilan/brightboard
git pull
cd backend
npm install
cd ../frontend
npm install
bower install
grunt
cd ../backend
# export NODE_ENV='production'
# printenv NODE_ENV
# sudo -E node app/setup/main.js | ./node_modules/.bin/bunyan

# Running with persistent environment variables for root
# http://askubuntu.com/questions/161924/how-do-i-set-persistent-environment-variables-for-root
# Some changes done inside node_modules and bower_install have to be updated offline for things to work
# Make sure that is done since it is not pushed into the git repository
cd /home/ubuntu/workspace/brightboard/frontend
bower install
sudo grunt
cd ../backend
sudo npm install
export NODE_ENV='production'
printenv NODE_ENV
sudo forever stop app/setup/main.js
sudo rm /home/ubuntu/.forever/brightboard_forever.log
sudo -E forever -l brightboard_forever.log -o brightboard_out.log -e brightboard_error.log start app/setup/main.js | ./node_modules/.bin/bunyan


#http://stackoverflow.com/questions/20426116/node-js-processes-with-the-same-name-in-forever-are-closed-when-trying-to-close
# sudo forever list - lists all the forever process. then use index to stop process
# sudo forever stop 0 -



