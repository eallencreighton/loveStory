
//User logs in for individual story page they can later share.
//Create private login per todo code along. Make this a different page, like the 
// Get separate firebase config.
//use google login.  Ask if user can have unique url generated?  Does this depend on hosting?


//Create user entry form to serve as queries into ajax call:
//lover's pronoun, location, fav artist or band.
//store user inputs in set state, same as movie database codealong.

//When you have the Ajax call, make sure you can store: top track?  Album? Year released, song duration? Display image in background.  

// Create Mad Libs template, local storage? Here refer back to todo app. store then display from firebase.


//Button “add a lover” refreshes page to beginning of process.  



//Nice to haves: Introvert, extrovert variety
//Tweet button adds unique url???
//Add location Ajax call, filter it in

//lastFM API Here are the details of your new API account.
// Application name tinderWHA
// API key  574e23d1c706eec2d420e57b15018a97
// Shared secret  7b652aa43a901caa317a37bdc5df5c6b
// Registered to  eallencreighton




import React from 'react';
import ReactDOM from 'react-dom';
import {ajax} from 'jquery';
import {
  BrowserRouter as Router,
  NavLink as Link,
  Route
} from 'react-router-dom';

const config = {
    apiKey: "AIzaSyAaCAWm8CPHcNUX7NnKTPHeJrKJGRxMOVY",
    authDomain: "tinderwhaat.firebaseapp.com",
    databaseURL: "https://tinderwhaat.firebaseio.com",
    projectId: "tinderwhaat",
    storageBucket: "tinderwhaat.appspot.com",
    messagingSenderId: "930589506117"
  };
  firebase.initializeApp(config);

//STORY 
//get the state object, rename it story.
 const googleApi_key="AIzaSyBt5FvlLF9NqPEDpZqDVReQ0IKHd51fLzs"




const api_key="574e23d1c706eec2d420e57b15018a97";
const rootURl = "http://ws.audioscrobbler.com/2.0/"

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        inputs: [{
        artist: '',
        location: ''
        }],
        artist: '',
        location: ''
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const usersInfo = {
      artist: this.state.artist,
      location: this.state.location
    }
    this.setState({
          artist: "",
          location:""
        })
    const dbRef = firebase.database().ref();
    dbRef.push(usersInfo)
   }
    render() {
      return (
        <Router>
              <div>
                <div>
                  <div>
                    <header>
                        <h1>LovenotONLINE </h1>
                      <form onSubmit={this.handleSubmit}>
                        <input name="artist" value={this.state.artist} onChange={this.handleChange} type="text" placeholder="Enter your favourite artist" />
                        <input name="location" value={this.state.location} onChange={this.handleChange} placeholder="Where did you meet?" type="text"/>
                        <input type="submit" value="Get Story" />
                      </form>
                    </header>
                    <div className="inputsDiv">
                    {this.state.inputs.map((input) => {
                      return (<Story data={input} key={input.key}/>)
                          })}
                     </div> 
                  </div>
                </div>
                <Link to="/">Home</Link>
                <Link to={`/story/${this.state.artist}`}>Story</Link>
                <Route path="/story/:artist" component={Story} />
              </div>
            </Router>  
        )
    }
  }
  class Story extends React.Component {
  constructor() {
    super();
        this.state = {
        artist: '',
        trackName: '',
        trackId: '',
        genre: '',
        duration: '',
        album: '',
        releaseDate: '',
        image: '',
        location: ''
    }
    this.getTopTracks = this.getTopTracks.bind(this);
    this.getTrackInfo = this.getTrackInfo.bind(this);
    this.getAlbumInfo = this.getAlbumInfo.bind(this);
  }
  componentDidMount() {
    const dbRef = firebase.database().ref();
    dbRef.on("value", (firebasedata) => {
        console.log(firebasedata.val())
        const userArray = [];
        const userData =firebasedata.val();
        for (let userKey in userData) {
          userArray.push(userData[userKey])
        }
        const stateSetArtist = userArray[0].artist
        const stateSetLocation = userArray[0].location
        console.log(stateSetLocation)
        this.setState ({
          artist: stateSetArtist,
          location: stateSetLocation
        })
    })
  }
  getTopTracks() {
   ajax({
        url: `http://ws.audioscrobbler.com/2.0/`,
        dataType: 'json',
        data:{
          method: 'artist.getTopTracks',
          api_key: '574e23d1c706eec2d420e57b15018a97',
          artist: `${this.props.match.params.artist}`,
          format: 'json' 
        }
      })
      .then((toptracks) => {
        console.log(toptracks)
        const trackName = toptracks.toptracks.track[0].name
        const trackId = toptracks.toptracks.track[0].mbid
        this.setState({
        trackName: trackName,
        trackId: trackId
      })
    this.getTrackInfo(trackId)
    })
}
  getTrackInfo(trackId) {
      ajax({
        url: `http://ws.audioscrobbler.com/2.0/`,
        dataType: 'json',
        data:{
          method: 'track.getInfo',
          api_key: '574e23d1c706eec2d420e57b15018a97',
          mbid: trackId,
          format: 'json' 
        }
      }).then((res) => {
        console.log(res)
        const genre = (res.track.toptags.tag[2].name + ' / ' + res.track.toptags.tag[0].name + ' / ' + res.track.toptags.tag[1].name)
        const duration = res.track.duration
        const album = res.track.album.title
        this.getAlbumInfo(album)
        this.setState({
         genre: genre,
         duration: duration,
         album: album
        })
      })
  }
  getAlbumInfo(album) {
    ajax({
        url: `http://ws.audioscrobbler.com/2.0/`,
        data:{
          method: 'album.getInfo',
          api_key: '574e23d1c706eec2d420e57b15018a97',
          artist: this.state.artist,
          album: album,
          format: 'json' 
        }
      }).then((res) => {
        const releaseDate = res.album.wiki.published
        //releaseDate: '',
        this.setState({
            releaseDate
        })
     })
   }
   getLocationInfo() {

   }
  render() {
    return (
      <div>
      <div className="story"> 
      </div>
      <div>
      {this.state.location} hello checking{this.state.artist}
      </div>
      <p>{this.props.data.artist}{this.state.trackName}{this.state.genre}{this.state.duration}{this.state.album}</p>
        <div>
        </div>
      </div>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('app'));

// app.js
ReactDOM.render(
  <Form />,
  document.getElementById('root')
)