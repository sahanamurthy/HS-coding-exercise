# HS-coding-exercise
Hello! Thank you for reviewing my submission for Highspot's Coding Exercise! :)

## Description
I have developed a command line application that will perform batch updates to a JSON dataset.
* The original dataset provided is located in `mixtape.json`. This file consists of multiple `user`, `playlist`, and `song` objects.
* I have created a file `changes.json` that consists of various changes to be made to the original dataset.
  * `changes.json` consists of `create`, `modify`, and `remove` objects. 
    * `create` contains the data (a `user id` and a list of `song`s) necessary to create a new playlist.
    * `modify` contains an `id` to an existing playlist to modify, along with a `song` to add to the playlist.
    * `remove` contains an `id` to an existing playlist to remove/delete.

The application located in `modifyPlaylists.js` will compare and combine the two datasets, and will output the result to `output.json`. 
`output.json` will be created upon successfully running the app.

## Running the app 
#### Set up instructions for Mac OS
1. Clone the repo
2. Run `npm install`
3. Install [Node.js](https://nodejs.org/en/)
4. Run `node modifyPlaylists.js` to run the app

## Considerations
```json
{
    "create" : [
        {
            "user_id" : "7",
            "song_ids" : [
                "7",
                "12",
                "13",
                "16",
                "2",
                "1"
            ]
        }
    ],
    "modify" : [
        {
            "id" : "3",
            "song_ids" : [
                "10"
            ]
        }
    ],
    "remove" : [
        {
            "id" : "1"
        }
    ]
}
```

`changes.json` is set up in a unique way that allows the user to provide only the information necessary to perform an action (`create`, `modify`, or `remove`).
This is advantageous as it allows this file to be as small as possible- allowing for easier scalability.
  * When intending to create a new playlist, the user needs only to pass in a `user id` and list of existing `songs` (there must be a minimum of one song).
    The application will generate the id for the playlist and append the `user id` and `song`s.
  * To modify an existing playlist, the user must pass in the `id` of the playlist they wish to modify and the ids of the existing songs they wish to add to the playlist.
    * If the application cannot locate the song id within `mixtape.json`, the song will not be added to the playlist.
    * There is no functionality in place to remove a song from a playlist.
    * There is also no functionality to transfer a playlist from one user to another.
  * To remove an existing playlist, the user must simply pass in the `id` of the playlist they wish to remove.
  
## Scalability
Optimizations that could be made for large file scalability:
  * Lazy JSON parsing that will only parse small portions of JSON on a need-basis, rather than parsing an entire (and large) file.
    * This may be achieved with [Cheshire.core](https://github.com/dakrone/cheshire) (this would require a switch to Clojure).
  * Improve efficiency of the algorithm in `modifyPlaylists.js` to provide quicker lookup of a JSON object within the provided data.
    * [node-clinic](https://github.com/clinicjs/node-clinic) can help us locate performance issues and areas for improvement.
  * Implement [fast-json-stringify](https://github.com/fastify/fast-json-stringify) which will allow us to pre-identify a schema so there's no need
    to traverse and identify the field type when stringifying. We can serialize the corresponding field directly, which drastically reduces the computational overhead.
    
