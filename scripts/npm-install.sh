yum -y install gcc-c++ make -y 
curl -sL https://rpm.nodesource.com/setup_8.x | sudo -E bash -
yum -y install nodejs 
npm i -g yarn 
cd /home/ec2/edulastic-poc
yarn 
