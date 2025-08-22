#!/bin/sh
while sleep 0.1; 
do 
    ls \
        $HOME/github.com/loicbourgois/miniciv/src/*.rs \
        $HOME/github.com/loicbourgois/miniciv/front/**/*.js \
    | entr -d $HOME/github.com/loicbourgois/miniciv/build.sh; 
done
