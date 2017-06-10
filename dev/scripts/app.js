
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
// Application name	tinderWHA
// API key	574e23d1c706eec2d420e57b15018a97
// Shared secret	7b652aa43a901caa317a37bdc5df5c6b
// Registered to	eallencreighton




import React from 'react';
import ReactDOM from 'react-dom';
import {ajax} from 'jquery';
import {
  BrowserRouter as Router,
  NavLink as Link,
  Route
} from 'react-router-dom';

//STORY 
//get the state object, rename it story.
const storyObject = {
      genre: 'Metal',
      trackName: 'Enter Sandman',
      artist: 'Metallica',
      album: 'Metallica',
      releaseDate: '1991',
      duration: '453243',
      similarArtist: ['Megadeth', 'Iron Maiden', 'Slayer'],
      image: 'http://unsplash.it/300/300',
      trackId: '',
}
 const googleApi_key="AIzaSyBt5FvlLF9NqPEDpZqDVReQ0IKHd51fLzs"


class Story extends React.Component {
  render() {
    return (
      <div className="story"> 
        testing
      </div>
    )
  }
}

const api_key="574e23d1c706eec2d420e57b15018a97";
const rootURl = "http://ws.audioscrobbler.com/2.0/"

class App extends React.Component {
    constructor() {
      super();
      this.state = { story: {
        artist: '',
        trackName: '',
        trackId: '',
        genre: '',
        duration: '',
        album: '',
        releaseDate: '',
        similarArtist: '',
        image: ''},
        location: ''
      }
      // console.log(this.state.artist)
      // console.log(this.state.trackName)
      // console.log(this.state.trackId)
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.getTrackInfo = this.getTrackInfo.bind(this);
      this.getAlbumInfo = this.getAlbumInfo.bind(this);
    }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  handleSubmit(e) {
    e.preventDefault();
    console.log('form submitted')
  
    console.log(this.state.artist)
      ajax({
        url: `http://ws.audioscrobbler.com/2.0/`,
        dataType: 'json',
        data:{
          method: 'artist.getTopTracks',
          api_key: '574e23d1c706eec2d420e57b15018a97',
          artist: this.state.artist,
          format: 'json' 
        }
      })
      .then((toptracks) => {
        console.log(toptracks)
        const trackName = toptracks.toptracks.track[0].name
        const trackId = toptracks.toptracks.track[0].mbid
        // this.setState({toptack})
        this.setState({
          trackName: trackName,
          trackId: trackId,
          artist: this.state.artist
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
   getSimilarArtists() {

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
                        <input type="submit" value="Get Story" />
                      </form>
                      <p>
              `I was hanging out at the mall feeling lonely when across the room I saw a beautiful creature, whose style screamed {this.state.genre}.  Suddenly {this.state.trackName} came on the sound system and of everyone in the room, we were the only ones to look up.  We locked eyes, knowing in an instant that we alone lived for {this.state.artist}. We walked closed together, magnetically drawn, then close enough to touch at the very same instant blurted out "{this.state.album} ? {this.state.releaseDate} ? Jinx...", then looked down as a blush spread across our faces. But with {this.state.duration} milliseconds left in the song, we knew it was now or never and suddenly, our lips were locked, the world was spinning, and it was like {this.state.artist} was there with us, blessing the union.  We walked away, hand in hand both dreaming of all the kisses to be had over  or  Who knew what would happen next?`
                </p>
                    </header>
                  </div>
                </div>
                <Link to="/">Home</Link>
                <Link to="/story">Story</Link>
                <Route path="/story" component={Story} />
              </div>
            </Router>  
        )
    }
    // componentDidMount() {
    //   ajax({
    //     url: `http://ws.audioscrobbler.com/2.0/`,
    //     dataType: 'json',
    //     data:{
    //       method: 'artist.getTopTracks',
    //       api_key: '574e23d1c706eec2d420e57b15018a97',
    //       artist: this.state.artist,
    //       format: 'json' 
    //     }
    //   })
    //   .then((toptracks) => {
    //     console.log(toptracks)
    //     const trackName = toptracks.toptracks.track[0].name
    //     const trackId = toptracks.toptracks.track[0].mbid
    //     // this.setState({toptack})
    //     this.setState({
    //       trackName: trackName,
    //       trackId: trackId
    //     })
    //   })
    // }
  }


ReactDOM.render(<App />, document.getElementById('app'));
