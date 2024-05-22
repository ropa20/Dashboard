TODAY="$(date +'%d%m%Y-%H:%M')"

echo ===================================================
echo Autodeploy server
echo $TODAY
echo ===================================================
echo Connecting to remote server...
output=$(ssh bb-do 'bash -i'  << ENDSSH
    #Connected
    #Go to client directory
    # echo "$TODAY"
    cd app/fullfily-client
    #Backup current version
    #mkdir old/"$TODAY"
    #rsync -av --progress ./ old/"$TODAY" --exclude old/ --exclude public/
    #Remove current version
    rm -rf *
    exit
ENDSSH
)
echo "$output"
echo Send new files to server
scp -r ./build/* bb-do:~/app/fullfily-client