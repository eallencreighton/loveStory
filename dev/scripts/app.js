
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

//STORY 
//get the state object, rename it story.
 const googleApi_key="AIzaSyByZjCYCnt15zaARIycR_TikDioIrhq47k"
 //AIzaSyDHEhL3DlleeIAkVfJ503JYqNmywjmIqi8

 //AIzaSyByZjCYCnt15zaARIycR_TikDioIrhq47k



const api_key="574e23d1c706eec2d420e57b15018a97";
const rootURl = "http://ws.audioscrobbler.com/2.0/"

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          artist: '',
          location: '',
          introvert: 'false'
      }
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  handleChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
        [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    // console.log('hi');

    // this.setState({
    //       artist: this.state.artist,
    //       location: this.state.location,
    //       introvert: this.state.introvert
    //   }, () => { 
    //   })


   }
    render() {
      return (
        <Router>
              <div>
                <div className="wrapper">
                  <header>
                    <Link className="mainHeading" to="/">
                    <h1 className="clip-text clip-text_one">Online Dating?</h1>
                    </Link>
                        <h2><em>Never heard of it..</em></h2> 
                      <h3>Embarrassed you met your love online? Tell me about yourself and I'll cook up an "alternative" how we met story</h3>
                      <form onSubmit={this.handleSubmit}>
                        <label htmlFor="introvert">Introvert?</label><input className="introvert" type="checkbox" name="introvert" value="true" onChange={this.handleChange}/><span>or </span>
                        <label htmlFor="extrovert">Extrovert?</label><input className="extrovert"type="checkbox"/>
                        <input className="artist" name="artist" value={this.state.artist} onChange={this.handleChange} type="text" placeholder="Who is your favourite musical artist or band?" />
                        <input className="location" name="location" value={this.state.location} onChange={this.handleChange} placeholder="In what city did you meet your love?" type="text"/>
                          <p>
                         <Link to={`/story/${this.state.artist}/${this.state.location}/${this.state.introvert}`}><input className="submit" type="submit" value="Get Story" /></Link>
                         </p>
                      </form>
                      </header>
                      <div className="computer">
                          <img className="computerImage" src="../../images/computer2.jpg" alt=""/>
                       
                         <div className="noHeart">
                            <svg className="heart" viewBox="0 0 32 29.6">
                              <path d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
                              c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"/>
                            </svg> 
                         </div>
                         <div className="noNo">   
                            <img className="noSymbol" src="../../images/no_symbol.png" alt=""/>
                        </div>
                    </div>
                  </div>
                  <Route exact path="/story/:artist/:location/:introvert" component={Story} />
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
        location: '',
        coffeeAddress: '',
        coffeename: '',
        landmarkStreet:'',
        landmarkName:'',
        introvert: '',
        image: ''
    }
    this.getTrackInfo = this.getTrackInfo.bind(this);
    this.getAlbumInfo = this.getAlbumInfo.bind(this);
    this.getLocationInfo = this.getLocationInfo.bind(this);
    this.getLandmarkInfo = this.getLandmarkInfo.bind(this);
    this.emptyHomeReturn = this.emptyHomeReturn.bind(this);
  }
  componentDidMount() {
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
      const trackName = toptracks.toptracks.track[0].name
      const trackId = toptracks.toptracks.track[0].mbid
      this.setState({
        trackName: trackName,
        trackId: trackId,
        introvert: this.props.match.params.introvert === 'true' ?  'true' : 'false'
      }, () => {
        window.scrollTo(0,document.body.scrollHeight);        
      });
      this.getTrackInfo(trackId)
    });
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
        const genre = (res.track.toptags.tag[2].name + ' / ' + res.track.toptags.tag[0].name + ' / ' + res.track.toptags.tag[1].name)
        const duration = res.track.duration
        const album = res.track.album.title
        this.getAlbumInfo(album)
        this.getLocationInfo()
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
    ajax({
      url: 'https://proxy.hackeryou.com',
      method: 'GET',
      dataType: 'json',
      data: {
        reqUrl: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
        params: {
            key: googleApi_key,
            query: `coffeehouses+in+${this.props.match.params.location}`
        },
        useCache: true
      }
    }).then((res) => {
        // console.log(res)
          const coffeeName = res.results[2].name
          const coffeeAddress1 = res.results[2].formatted_address
          const coffeeStreet = coffeeAddress1.substring(0, coffeeAddress1.indexOf(','));
          const coffeeAddress = coffeeStreet.substring(coffeeStreet.indexOf(" ") + 1);
          this.getLandmarkInfo() 
          this.setState({
            coffeeAddress,
            coffeeName,
          })
          // console.log(coffeeName)
          // console.log(coffeeAddress)
      })
    }
    getLandmarkInfo() {
      ajax({
      url: 'https://proxy.hackeryou.com',
      method: 'GET',
      dataType: 'json',
      data: {
        reqUrl: 'https://maps.googleapis.com/maps/api/place/textsearch/json',
        params: {
            key: googleApi_key,
            query: `point_of_interest+in+${this.props.match.params.location}`
        },
        useCache: true
      }
    }).then((res) => {
              // console.log(res)
                    const landmarkName = res.results[0].name
                    const landmarkAddress = res.results[0].formatted_address
                    const landmarkStreetN = landmarkAddress.substring(0, landmarkAddress.indexOf(','));
                    const landmarkStreet = landmarkStreetN.substring(landmarkStreetN.indexOf(" ") + 1);
                    this.setState({
                      landmarkName,
                      landmarkStreet 
                    })
                })

    }
    emptyHomeReturn() {
      window.location.replace("/");
    }
  render() {
    // console.log(this.state.introvert)
    const showStory = () => {
      // console.log(this.state)
        if (this.state.introvert === "true") {
            return(
              <div className="outerStory">
                <div id ="toStory"className="storyWrapper">
                  <h3 className="storyTitle"><em>Our story</em></h3>
                  <p>Well, we'd known each other for 6 years, but I never thought anything could happen.  But one day, walking along {this.state.coffeeAddress} on a work retreat, it started to rain and we dodged into {this.state.coffeeName} to dry off.</p>
                  <p>  There we were in the same room, finally, but I had no idea what to say until <em> {this.state.trackName}</em> came over the sound system and our eyes met! Someone who knew {this.props.match.params.artist}! Shy as we had been til then, we suddenly blurted out together "{this.state.album}? {this.state.releaseDate}"!.  I had never connected to someone so deeply.  For a full {this.state.duration} milliseconds of {this.props.match.params.artist} we gazed into each others eyes, then looked down as blushes spread across both our faces.  </p>
                  <p>As the rain let up, we walked down {this.state.landmarkStreet} together, side by side, less than a metre apart! On our left, {this.state.landmarkName} appeared, and now every year at exactly the same time, we go there and sit beside each other, listening to {this.state.genre} holding hands. </p>
                  <div>
                  <button className="getAnother" onClick={this.emptyHomeReturn}>Get another love story</button>
                  </div>
                </div>
              </div>
        )
       } else {
        return(
          <div className="outerStory">
            <div id ="toStory" className="storyWrapper">
              <h3 className="storyTitle" ><em>Our story</em></h3>
              <p>I was strutting along {this.state.coffeeAddress} and decided to power up at {this.state.coffeeName} but then across from me, Wow! the hottest creature I've ever seen, whose style screamed {this.state.genre} caught my eye. </p>
              <p>Suddenly, <em>{this.state.trackName}</em> came through the air and we both looked up, locking eyes, knowing that we alone lived for {this.props.match.params.artist}. We grinned, then magnetically drew closer together, till face to face at the exact same time we blurted out: "{this.state.album}? {this.state.releaseDate}? Jinx!" but with {this.state.duration} milliseconds left in the song, we somehow knew it was now or never, rushed forward and locked lips. It was like {this.props.match.params.artist} was there with us, blessing the union.</p>
              <p>After, with arms wrapped tight 'rround each other's waists, we drifted along {this.state.landmarkStreet} passing the {this.state.landmarkName} and laughing away at our good fortune.  Who knew this was the day we'd find our soulmate?</p>
              <div>
                <button className="getAnother" onClick={this.emptyHomeReturn}>Get another love story</button>
              </div>
            </div>
          </div>
         )
       }
     } 
    return (
      <main>
        {showStory()}
      </main>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
