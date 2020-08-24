#!/bin/bash

// Invoke Node.js File System module to access and interact with JSON files
const fs = require('fs')

// Print an intro message to user so they are aware that they are exercising the application
let intro = "Hello and welcome to Sahana's Highspot Coding Exercise!";
console.log(intro);

// Read mixtape.json file and parse the JSON into a JavaSript object so we can interact with it
var mixtapeJSON = fs.readFileSync("mixtape.json");
var mixtape = JSON.parse(mixtapeJSON);

// Read changes.json file and parse the JSON into a JavaSript object so we can interact with it
var changesJSON = fs.readFileSync("changes.json");
var changes = JSON.parse(changesJSON);

// Call function to create new playlist if changes.json contains a change to add a new playlist
if (changes.create.length > 0)
{
    createNewPlaylist();
}

// Call function to add a song to a playlist if changes.json contains a modify object
if (changes.modify.length > 0)
{
    addSongToExistingPlaylist();
}

// Call function to remove a playlist if changes.json contains a remove object
if (changes.remove.length > 0)
{   
    removePlaylist();
}

// Convert the inteded output into JSON
var jsonOutput = JSON.stringify(mixtape);

// Creat output.json
fs.writeFile("output.json", jsonOutput, (err) => {
    if (err)
    {
        console.error(err);
        return;
    }

    console.log("Changes completed and outputed to output.json");
})

function createNewPlaylist() 
{
    for (let i=0; i<changes.create.length; i++)
    {
        // Retrieve last playlist id in mixtape.json
        var lastId = mixtape.playlists[mixtape.playlists.length-1]["id"];

        // Create id for new playlist
        var newId = (parseInt(lastId)+1).toString();

        var newPlaylist = {
            "id" : newId,
            "user_id" : changes.create[i]["user_id"],
            "song_ids" : changes.create[i]["song_ids"]
       };

        mixtape.playlists.push(newPlaylist);
        console.log(`Added playlist ${newPlaylist["id"]}`);
    }

    return;
}

function addSongToExistingPlaylist()
{
    for (let i=0; i<changes.modify.length; i++)
    {
        var playlistId = changes.modify[i]["id"];
        
        // Find playlist location in mixtape.json
        var playlistInMixtape = mixtape.playlists.filter(function(playlist) 
        {
            return playlist.id === playlistId; 
        })  

        // If the playlist does not exist in mixtape.json, log an error
        if (playlistInMixtape.length == 0)
        {
            var err = `Cannot modify playlist ${playlistId}. Playlist does not exist.`
            console.error(err);
            continue;
        }

        for (let j=0; j<changes.modify[i]["song_ids"].length; j++)
        {
            var currentSong = changes.modify[i]["song_ids"][i];
            
            // Verify the song exists in mixtape.json
            var songExists = mixtape.songs.filter(function(song) 
            {
                return song.id === currentSong; 
            })  

            // If song does not exist, log an error
            if (songExists.length == 0)
            {
                var err = `Unable to add song ${currentSong}. Song does not exist.`
                console.error(err);
            }
            
            // Append song to playlist's songs
            playlistInMixtape[0]["song_ids"].push(currentSong);
        }
        console.log(`Modified playlist ${playlistId}`);
    }

    return;
}

function removePlaylist()
{
    for (let i=0; i<changes.remove.length; i++)
    {
        var playlistId = changes.remove[i]["id"];

        // Find playlist location in mixtape.json
        var playlistInMixtape = mixtape.playlists.filter(function(playlist) 
        {
            return playlist.id === playlistId; 
        })  
        
        // If playlist does not exist, log an error
        if (playlistInMixtape.length == 0)
        {
            var err = `Cannot delete playlist ${playlistId}. Playlist does not exist.`
            console.error(err);
            continue;
        }

        // Remove playlist from mixtape.json
        delete mixtape.playlists[0];
        mixtape.playlists.splice(0,1);
        console.log(`Deleted playlist ${playlistId}`);  
    }

    return;
}